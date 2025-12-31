// ============================================
// TOURNAMENT MANAGEMENT
// ============================================

let tournamentPlayers = [];
let autoRefreshInterval = null;

// Load tournament list for users - only show tournaments with player fields
async function loadTournamentList() {
    if (!db) {
        console.error('Database not initialized');
        return;
    }
    
    console.log('Loading tournament list...');
    
    try {
        const tournamentsSnapshot = await db.ref('tournaments').once('value');
        const tournaments = tournamentsSnapshot.val() || {};
        console.log('Tournaments loaded:', Object.keys(tournaments).length, tournaments);
        
        const playerFieldsSnapshot = await db.ref('playerFields').once('value');
        const playerFields = playerFieldsSnapshot.val() || {};
        console.log('Player fields loaded:', Object.keys(playerFields).length, playerFields);
        
        const tournamentSelect = document.getElementById('tournamentSelect');
        if (!tournamentSelect) {
            console.error('Tournament select element not found');
            return;
        }
        
        tournamentSelect.innerHTML = '<option value="">-- Select tournament --</option>';
        
        // Sort tournaments by start date
        const sortedTournaments = Object.entries(tournaments)
            .sort((a, b) => new Date(a[1].startDate) - new Date(b[1].startDate));
        
        let availableCount = 0;
        
        sortedTournaments.forEach(([id, tournament]) => {
            // Check if player field exists (can be array or object)
            const playerField = playerFields[id];
            const hasPlayers = playerField && (
                (Array.isArray(playerField) && playerField.length > 0) ||
                (typeof playerField === 'object' && Object.keys(playerField).length > 0)
            );
            
            const playerCount = playerField ? 
                (Array.isArray(playerField) ? playerField.length : Object.keys(playerField).length) : 0;
            
            console.log(`Checking tournament ${id}:`, {
                hasPlayerField: !!playerField,
                playerCount: playerCount,
                isArray: Array.isArray(playerField)
            });
            
            // Only show tournaments that have a player field
            if (hasPlayers) {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = tournament.name;
                tournamentSelect.appendChild(option);
                availableCount++;
                console.log(`  ✅ Added to dropdown: ${tournament.name}`);
            } else {
                console.log(`  ❌ Skipped (no player field): ${tournament.name}`);
            }
        });
        
        console.log(`Tournament dropdown populated with ${availableCount} tournaments`);
        
        if (availableCount === 0) {
            showStatus('No tournaments with player fields available yet. Check back soon!', 'info');
        } else {
            showStatus('', '');
        }
    } catch (error) {
        console.error('Error loading tournaments:', error);
        showStatus('Error loading tournaments', 'error');
    }
}

// Load tournament when selected
async function loadTournament() {
    const tournamentSelect = document.getElementById('tournamentSelect');
    const tournamentId = tournamentSelect.value;
    
    if (!tournamentId) {
        document.getElementById('tournamentInfo').classList.add('hidden');
        document.getElementById('wizardContainer').classList.add('hidden');
        return;
    }
    
    try {
        // Get tournament data
        const snapshot = await db.ref(`tournaments/${tournamentId}`).once('value');
        const tournament = snapshot.val();
        
        if (!tournament) {
            showStatus('Tournament not found', 'error');
            return;
        }
        
        currentTournament = { id: tournamentId, ...tournament };
        
        // Display tournament info
        displayTournamentInfo(tournament);
        
        // Check if picks are locked
        // TEMPORARILY DISABLED FOR TESTING - Re-enable later via admin toggle
        const isLocked = false; // checkPicksLocked(tournament);
        
        if (isLocked) {
            document.getElementById('picksLockedMessage').classList.remove('hidden');
            document.getElementById('wizardContainer').classList.add('hidden');
            showStatus('Picks are locked for this tournament', 'warning');
        } else {
            document.getElementById('picksLockedMessage').classList.add('hidden');
            
            // Load player field
            await loadPlayerField(tournament);
            
            // Load existing picks if any
            await loadExistingPicks(tournamentId);
            
            // Initialize wizard
            initializeWizard();
        }
        
    } catch (error) {
        console.error('Error loading tournament:', error);
        showStatus('Error loading tournament', 'error');
    }
}

// Display tournament information
function displayTournamentInfo(tournament) {
    const infoDiv = document.getElementById('tournamentInfo');
    const nameEl = document.getElementById('tournamentName');
    const detailsEl = document.getElementById('tournamentDetails');
    const warningEl = document.getElementById('pickDeadlineWarning');
    
    if (!infoDiv || !nameEl || !detailsEl) return;
    
    nameEl.textContent = tournament.name;
    
    const startDate = new Date(tournament.startDate);
    const endDate = new Date(tournament.endDate);
    const dateStr = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    
    let details = dateStr;
    if (tournament.course) {
        details += ` • ${tournament.course}`;
    }
    if (tournament.location) {
        details += ` • ${tournament.location}`;
    }
    if (tournament.purse) {
        const purseStr = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(tournament.purse);
        details += ` • ${purseStr}`;
    }
    
    detailsEl.textContent = details;
    
    // Show deadline warning
    const deadline = new Date(tournament.pickDeadline || tournament.startDate);
    const now = new Date();
    const hoursUntilDeadline = (deadline - now) / (1000 * 60 * 60);
    
    if (hoursUntilDeadline > 0 && hoursUntilDeadline < 24) {
        warningEl.classList.remove('hidden');
        warningEl.innerHTML = `<strong>⏰ Picks lock in ${Math.floor(hoursUntilDeadline)} hours at ${deadline.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Denver' })} MT</strong>`;
    } else {
        warningEl.classList.add('hidden');
    }
    
    infoDiv.classList.remove('hidden');
}

// Check if picks are locked
function checkPicksLocked(tournament) {
    const deadline = new Date(tournament.pickDeadline || tournament.startDate);
    const now = new Date();
    return now >= deadline;
}

// Load player field from ESPN or Firebase
async function loadPlayerField(tournament) {
    showStatus('Loading player field...', 'info');
    
    try {
        // Try to get from ESPN if tournament has ESPN ID
        if (tournament.espnId) {
            const espnData = await ESPN_API.fetchCompetitors(tournament.espnId);
            
            if (espnData && espnData.length > 0) {
                tournamentPlayers = espnData;
                console.log(`Loaded ${espnData.length} players from ESPN`);
                showStatus('', '');
                return;
            }
        }
        
        // Fallback: try to get from Firebase
        const snapshot = await db.ref(`playerFields/${tournament.id || currentTournament.id}`).once('value');
        const fbPlayers = snapshot.val();
        
        if (fbPlayers && fbPlayers.length > 0) {
            tournamentPlayers = fbPlayers;
            console.log(`Loaded ${fbPlayers.length} players from Firebase`);
            showStatus('', '');
        } else {
            tournamentPlayers = [];
            showStatus('No player field available. Contact admin.', 'warning');
        }
        
    } catch (error) {
        console.error('Error loading player field:', error);
        tournamentPlayers = [];
        showStatus('Error loading player field', 'error');
    }
}

// Load existing picks for this tournament
async function loadExistingPicks(tournamentId) {
    if (!currentUser || isAdmin) return;
    
    try {
        const snapshot = await db.ref(`picks/${currentUser}/${tournamentId}`).once('value');
        const picks = snapshot.val();
        
        console.log(`Loading picks for user: ${currentUser}, tournament: ${tournamentId}`, picks);
        
        if (picks) {
            // Populate wizard state with existing picks - but start at step 1 to allow editing
            wizardState = {
                step: 1, // Start at step 1 so user can review/edit
                winnerPick: picks.winnerPick,
                altWinner: picks.altWinner,
                alternate1: picks.alternate1,
                alternate2: picks.alternate2,
                tiebreaker: picks.tiebreaker,
                basePlayers: picks.basePlayers || []
            };
            
            showStatus('Your existing picks have been loaded. You can review and edit them before the deadline.', 'info');
        } else {
            // Reset wizard state for new picks
            wizardState = {
                step: 1,
                winnerPick: null,
                altWinner: null,
                alternate1: null,
                alternate2: null,
                tiebreaker: null,
                basePlayers: []
            };
        }
    } catch (error) {
        console.error('Error loading existing picks:', error);
        // On error, reset to clean state
        wizardState = {
            step: 1,
            winnerPick: null,
            altWinner: null,
            alternate1: null,
            alternate2: null,
            tiebreaker: null,
            basePlayers: []
        };
    }
}

// Load dashboard for current tournament
async function loadDashboard() {
    const container = document.getElementById('dashboardContainer');
    
    if (!currentTournament) {
        container.innerHTML = '<p class="info-message">Please select a tournament from the Picks tab to view the dashboard.</p>';
        return;
    }
    
    container.innerHTML = '<div class="loading">Loading dashboard</div>';
    
    try {
        // Get all user picks for this tournament
        const picksSnapshot = await db.ref('picks').once('value');
        const allPicks = picksSnapshot.val() || {};
        
        // Get users for display names
        const usersSnapshot = await db.ref('users').once('value');
        const users = usersSnapshot.val() || {};
        
        let html = `<h3>${currentTournament.name} - Dashboard</h3>`;
        
        // Check if tournament has started
        const now = new Date();
        const startDate = new Date(currentTournament.startDate);
        const hasStarted = now >= startDate;
        
        if (!hasStarted) {
            html += '<div class="info-message">Tournament hasn\'t started yet. Picks will be visible after the tournament begins.</div>';
            
            // Show user's own picks
            if (allPicks[currentUser] && allPicks[currentUser][currentTournament.id]) {
                html += '<h4>Your Picks:</h4>';
                html += formatPicksSummary(allPicks[currentUser][currentTournament.id]);
            }
        } else {
            // Tournament started - show all picks
            html += '<div class="success-message">Tournament in progress! Good luck! 🍀</div>';
            
            // Display all user picks
            Object.keys(allPicks).forEach(username => {
                const userPicks = allPicks[username][currentTournament.id];
                if (userPicks) {
                    const displayName = users[username]?.displayName || username;
                    html += `<div class="admin-panel"><h4>${displayName}'s Team</h4>`;
                    html += formatPicksSummary(userPicks);
                    html += '</div>';
                }
            });
        }
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        container.innerHTML = '<p class="error-message">Error loading dashboard</p>';
    }
}

// Format picks summary
function formatPicksSummary(picks) {
    let html = '<div style="margin: 15px 0;">';
    
    html += `<p><strong>⭐ Winner Pick:</strong> ${getPlayerName(picks.winnerPick)}</p>`;
    html += `<p><strong>🔄 Alternate Winner:</strong> ${getPlayerName(picks.altWinner)}</p>`;
    html += `<p><strong>🅰️ Alternate #1:</strong> ${getPlayerName(picks.alternate1)}</p>`;
    html += `<p><strong>🅱️ Alternate #2:</strong> ${getPlayerName(picks.alternate2)}</p>`;
    html += `<p><strong>🎯 Tiebreaker:</strong> ${getPlayerName(picks.tiebreaker)}</p>`;
    
    if (picks.basePlayers && picks.basePlayers.length > 0) {
        html += '<p><strong>Base Team (10 players):</strong></p><ul>';
        picks.basePlayers.forEach(playerId => {
            html += `<li>${getPlayerName(playerId)}</li>`;
        });
        html += '</ul>';
    }
    
    html += '</div>';
    return html;
}

// Get player name by ID
function getPlayerName(playerId) {
    if (!playerId) return 'Not selected';
    
    const player = tournamentPlayers.find(p => 
        PlayerData.getPlayerId(p) === playerId
    );
    
    return player ? PlayerData.formatPlayerName(player) : playerId;
}

// Load standings
async function loadStandings() {
    const container = document.getElementById('standingsContainer');
    container.innerHTML = '<div class="loading">Loading standings</div>';
    
    try {
        // This is a placeholder - full standings calculation would go here
        container.innerHTML = `
            <div class="info-message">
                <p>Season standings will be calculated after tournaments are completed.</p>
                <p>Standings will show:</p>
                <ul style="margin-top: 10px; margin-left: 20px;">
                    <li>Total earnings across all tournaments</li>
                    <li>Bonus money earned</li>
                    <li>Tournament wins</li>
                    <li>Overall champion</li>
                </ul>
            </div>
        `;
    } catch (error) {
        console.error('Error loading standings:', error);
        container.innerHTML = '<p class="error-message">Error loading standings</p>';
    }
}
