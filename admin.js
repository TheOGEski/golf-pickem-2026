// ============================================
// ADMIN PANEL
// ============================================

// Load admin tournament list
async function loadAdminTournamentList() {
    const container = document.getElementById('tournamentList');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading tournaments</div>';
    
    try {
        const snapshot = await db.ref('tournaments').once('value');
        const tournaments = snapshot.val() || {};
        
        if (Object.keys(tournaments).length === 0) {
            container.innerHTML = '<p class="info-message">No tournaments yet. Click "Add Tournament" to create one.</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
        
        // Sort by start date
        const sortedTournaments = Object.entries(tournaments)
            .sort((a, b) => new Date(a[1].startDate) - new Date(b[1].startDate));
        
        sortedTournaments.forEach(([id, tournament]) => {
            const startDate = new Date(tournament.startDate).toLocaleDateString();
            const status = tournament.status || 'scheduled';
            
            html += `
                <div class="admin-panel" style="margin: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h4 style="margin: 0 0 10px 0; color: #2d5016;">${tournament.name}</h4>
                            <p style="margin: 5px 0; color: #666;">
                                📅 ${startDate} • 📍 ${tournament.location || 'TBD'}
                                ${tournament.espnId ? ' • 🔗 ESPN ID: ' + tournament.espnId : ''}
                            </p>
                            <p style="margin: 5px 0;"><strong>Status:</strong> ${status}</p>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn btn-secondary" onclick="editTournament('${id}')" style="padding: 8px 16px; font-size: 14px;">Edit</button>
                            <button class="btn btn-danger" onclick="deleteTournament('${id}')" style="padding: 8px 16px; font-size: 14px;">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        // Also populate admin tournament select
        populateAdminTournamentSelect(tournaments);
        
    } catch (error) {
        console.error('Error loading tournaments:', error);
        container.innerHTML = '<p class="error-message">Error loading tournaments</p>';
    }
}

// Populate admin tournament select
function populateAdminTournamentSelect(tournaments) {
    const select = document.getElementById('adminTournamentSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Select tournament --</option>';
    
    Object.entries(tournaments)
        .sort((a, b) => new Date(a[1].startDate) - new Date(b[1].startDate))
        .forEach(([id, tournament]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = tournament.name;
            select.appendChild(option);
        });
}

// Show add tournament form
function showAddTournamentForm() {
    const form = document.getElementById('addTournamentForm');
    form.classList.remove('hidden');
    
    // Clear form
    document.getElementById('newTournamentName').value = '';
    document.getElementById('newTournamentEspnId').value = '';
    document.getElementById('newTournamentStartDate').value = '';
    document.getElementById('newTournamentEndDate').value = '';
    document.getElementById('newTournamentCourse').value = '';
    document.getElementById('newTournamentLocation').value = '';
    document.getElementById('newTournamentPurse').value = '';
    document.getElementById('newTournamentFedupCup').checked = false;
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
}

// Cancel add tournament
function cancelAddTournament() {
    document.getElementById('addTournamentForm').classList.add('hidden');
}

// Save tournament
async function saveTournament() {
    const name = document.getElementById('newTournamentName').value.trim();
    const espnId = document.getElementById('newTournamentEspnId').value.trim();
    const startDate = document.getElementById('newTournamentStartDate').value;
    const endDate = document.getElementById('newTournamentEndDate').value;
    const course = document.getElementById('newTournamentCourse').value.trim();
    const location = document.getElementById('newTournamentLocation').value.trim();
    const purse = parseInt(document.getElementById('newTournamentPurse').value) || 0;
    const isFedupCup = document.getElementById('newTournamentFedupCup').checked;
    
    if (!name || !startDate || !endDate) {
        showStatus('Please fill in tournament name, start date, and end date', 'error');
        return;
    }
    
    try {
        // Create tournament ID
        const tournamentId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        // Calculate pick deadline (10:00 AM MT on start date)
        const startDateTime = new Date(startDate);
        const pickDeadline = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), 10, 0, 0);
        
        const tournamentData = {
            name,
            espnId: espnId || null,
            startDate: startDate + 'T07:00:00Z',
            endDate: endDate + 'T07:00:00Z',
            course: course || '',
            location: location || '',
            purse: purse,
            pickDeadline: pickDeadline.toISOString(),
            status: 'scheduled',
            isFedupCup: isFedupCup,
            created: Date.now()
        };
        
        await db.ref(`tournaments/${tournamentId}`).set(tournamentData);
        
        // If ESPN ID provided, try to fetch player field
        if (espnId) {
            showStatus('Tournament saved! Fetching player field from ESPN...', 'success');
            
            try {
                const players = await ESPN_API.fetchCompetitors(espnId);
                
                console.log(`ESPN Players for ${tournamentId}:`, players); // Debug
                
                if (players && players.length > 0) {
                    await db.ref(`playerFields/${tournamentId}`).set(players);
                    showStatus(`✅ Tournament saved with ${players.length} players! Users can now see this tournament.`, 'success');
                } else {
                    showStatus(`⚠️ Tournament saved, but no players found. Users won't see this tournament until you add a player field.`, 'warning');
                }
            } catch (playerError) {
                console.error('Error fetching players:', playerError);
                showStatus('⚠️ Tournament saved, but error fetching players from ESPN.', 'warning');
            }
        } else {
            showStatus('Tournament saved successfully! Add an ESPN ID to fetch player field.', 'success');
        }
        
        cancelAddTournament();
        loadAdminTournamentList();
        
    } catch (error) {
        console.error('Error saving tournament:', error);
        showStatus('Error saving tournament: ' + error.message, 'error');
    }
}

// Delete tournament
async function deleteTournament(tournamentId) {
    if (!confirm('Are you sure you want to delete this tournament? This cannot be undone.')) {
        return;
    }
    
    try {
        await db.ref(`tournaments/${tournamentId}`).remove();
        await db.ref(`playerFields/${tournamentId}`).remove();
        
        showStatus('Tournament deleted', 'success');
        loadAdminTournamentList();
        
    } catch (error) {
        console.error('Error deleting tournament:', error);
        showStatus('Error deleting tournament', 'error');
    }
}

// Edit tournament (simplified - just delete and recreate for now)
function editTournament(tournamentId) {
    showStatus('To edit: delete and recreate the tournament, or contact developer for edit feature.', 'info');
}

// Import from ESPN - Show tournament selector
async function importFromESPN() {
    showStatus('Loading PGA Tour calendar from ESPN...', 'info');
    
    try {
        const calendar = await ESPN_API.fetchCalendar();
        
        if (!calendar || calendar.length === 0) {
            showStatus('Could not fetch tournament calendar from ESPN.', 'error');
            return;
        }
        
        // Create a modal-style selector
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px;';
        
        const content = document.createElement('div');
        content.style.cssText = 'background: white; padding: 30px; border-radius: 12px; max-width: 800px; max-height: 80vh; overflow-y: auto; width: 100%;';
        
        let html = '<h2 style="color: #2d5016; margin-bottom: 20px;">Select Tournament from ESPN</h2>';
        html += '<div style="margin-bottom: 20px;"><input type="text" id="espnSearchBox" placeholder="🔍 Search tournaments..." style="width: 100%; padding: 12px; border: 2px solid #7cb342; border-radius: 8px; font-size: 16px;"></div>';
        html += '<div id="espnTournamentList" style="display: flex; flex-direction: column; gap: 10px;">';
        
        calendar.forEach(event => {
            const startDate = new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            html += `
                <div class="espn-tournament-item" data-name="${event.label.toLowerCase()}" style="padding: 15px; background: #e8f5e9; border-radius: 8px; cursor: pointer; transition: all 0.2s;" 
                     onmouseover="this.style.background='#c8e6c9'" 
                     onmouseout="this.style.background='#e8f5e9'"
                     onclick="selectESPNTournament('${event.id}', '${event.label.replace(/'/g, "\\'")}', '${event.startDate}', '${event.endDate}')">
                    <div style="font-weight: 600; color: #2d5016; margin-bottom: 5px;">${event.label}</div>
                    <div style="font-size: 14px; color: #666;">📅 ${startDate} • ESPN ID: ${event.id}</div>
                </div>
            `;
        });
        
        html += '</div>';
        html += '<button onclick="this.parentElement.parentElement.remove()" class="btn btn-secondary" style="margin-top: 20px;">Cancel</button>';
        
        content.innerHTML = html;
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Add search functionality
        setTimeout(() => {
            const searchBox = document.getElementById('espnSearchBox');
            searchBox.focus();
            searchBox.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                document.querySelectorAll('.espn-tournament-item').forEach(item => {
                    const name = item.dataset.name;
                    item.style.display = name.includes(searchTerm) ? 'block' : 'none';
                });
            });
        }, 100);
        
        showStatus('', '');
        
    } catch (error) {
        console.error('Error loading ESPN calendar:', error);
        showStatus('Error loading ESPN calendar', 'error');
    }
}

// Select ESPN tournament and populate form
async function selectESPNTournament(espnId, name, startDate, endDate) {
    // Remove modal
    document.querySelectorAll('div[style*="position: fixed"]').forEach(el => el.remove());
    
    showStatus(`Loading ${name} details from ESPN...`, 'info');
    
    try {
        // Fetch full tournament details to get venue/location
        const fullData = await ESPN_API.fetchTournament(espnId);
        
        console.log('ESPN Tournament Data:', fullData); // Debug log
        
        // Pre-fill the form
        document.getElementById('newTournamentName').value = fullData?.name || name;
        document.getElementById('newTournamentEspnId').value = espnId;
        document.getElementById('newTournamentStartDate').value = startDate ? startDate.substring(0, 10) : '';
        document.getElementById('newTournamentEndDate').value = endDate ? endDate.substring(0, 10) : '';
        document.getElementById('newTournamentCourse').value = fullData?.venue || '';
        document.getElementById('newTournamentLocation').value = fullData?.location || '';
        document.getElementById('newTournamentPurse').value = '';
        
        showAddTournamentForm();
        
        if (fullData?.venue || fullData?.location) {
            showStatus('Tournament loaded from ESPN with all details! Click Save.', 'success');
        } else {
            showStatus('Tournament loaded! Please manually add course/location and click Save.', 'warning');
        }
        
    } catch (error) {
        console.error('Error fetching full tournament details:', error);
        
        // Fallback: use calendar data only
        document.getElementById('newTournamentName').value = name;
        document.getElementById('newTournamentEspnId').value = espnId;
        document.getElementById('newTournamentStartDate').value = startDate ? startDate.substring(0, 10) : '';
        document.getElementById('newTournamentEndDate').value = endDate ? endDate.substring(0, 10) : '';
        
        showAddTournamentForm();
        showStatus('Tournament loaded! Manually add course/location and click Save.', 'warning');
    }
}

// Load user list
async function loadUserList() {
    const container = document.getElementById('userList');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading users</div>';
    
    try {
        const snapshot = await db.ref('users').once('value');
        const users = snapshot.val() || {};
        
        if (Object.keys(users).length === 0) {
            container.innerHTML = '<p class="info-message">No users yet. Add users above.</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px;">';
        
        Object.keys(users).sort().forEach(username => {
            const user = users[username];
            const displayName = user.displayName || username;
            
            html += `
                <div style="background: #e8f5e9; padding: 12px 16px; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                    <span style="font-weight: 600; color: #2d5016;">${displayName}</span>
                    <button onclick="deleteUser('${username}')" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        // Populate admin user select
        const userSelect = document.getElementById('adminUserSelect');
        if (userSelect) {
            userSelect.innerHTML = '<option value="">-- Select user --</option>';
            Object.keys(users).sort().forEach(username => {
                const option = document.createElement('option');
                option.value = username;
                option.textContent = users[username].displayName || username;
                userSelect.appendChild(option);
            });
        }
        
    } catch (error) {
        console.error('Error loading users:', error);
        container.innerHTML = '<p class="error-message">Error loading users</p>';
    }
}

// Add user
async function addUser() {
    const username = document.getElementById('newUsername').value.trim();
    const displayName = document.getElementById('newDisplayName').value.trim();
    
    if (!username || !displayName) {
        showStatus('Please enter both username and display name', 'error');
        return;
    }
    
    const sanitized = sanitizeUsername(username);
    
    try {
        // Check if user already exists
        const snapshot = await db.ref(`users/${sanitized}`).once('value');
        if (snapshot.exists()) {
            showStatus('User already exists', 'error');
            return;
        }
        
        await db.ref(`users/${sanitized}`).set({
            username: username,
            displayName: displayName,
            passwordSet: false,
            created: Date.now()
        });
        
        showStatus(`User "${displayName}" added successfully!`, 'success');
        
        document.getElementById('newUsername').value = '';
        document.getElementById('newDisplayName').value = '';
        
        loadUserList();
        
    } catch (error) {
        console.error('Error adding user:', error);
        showStatus('Error adding user', 'error');
    }
}

// Delete user
async function deleteUser(username) {
    if (!confirm(`Delete user "${username}"? This will also delete all their picks.`)) {
        return;
    }
    
    try {
        await db.ref(`users/${username}`).remove();
        await db.ref(`picks/${username}`).remove();
        
        showStatus('User deleted', 'success');
        loadUserList();
        
    } catch (error) {
        console.error('Error deleting user:', error);
        showStatus('Error deleting user', 'error');
    }
}

// Load user picks (for admin viewing/editing)
async function loadUserPicks() {
    const username = document.getElementById('adminUserSelect').value;
    const tournamentId = document.getElementById('adminTournamentSelect').value;
    const container = document.getElementById('adminPicksContainer');
    
    if (!username || !tournamentId) {
        showStatus('Please select both user and tournament', 'error');
        return;
    }
    
    try {
        const snapshot = await db.ref(`picks/${username}/${tournamentId}`).once('value');
        const picks = snapshot.val();
        
        container.classList.remove('hidden');
        
        if (!picks) {
            container.innerHTML = '<p class="info-message">This user has not made picks for this tournament yet.</p>';
            return;
        }
        
        const usersSnapshot = await db.ref(`users/${username}`).once('value');
        const user = usersSnapshot.val();
        const displayName = user?.displayName || username;
        
        let html = `<h4>${displayName}'s Picks</h4>`;
        html += formatPicksSummary(picks);
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading user picks:', error);
        container.innerHTML = '<p class="error-message">Error loading picks</p>';
    }
}

// ============================================
// TEST TOURNAMENT SIMULATOR
// ============================================

// Update simulator status display
async function updateSimulatorStatus() {
    const statusElement = document.getElementById('simStatus');
    const roundElement = document.getElementById('simRound');
    const wdElement = document.getElementById('simWDs');
    
    if (!statusElement || !roundElement || !wdElement) return;
    
    try {
        const status = await getSimulationStatus();
        statusElement.textContent = status.status;
        roundElement.textContent = status.currentRound;
        wdElement.textContent = status.withdrawalCount || 0;
    } catch (error) {
        console.error('Error updating simulator status:', error);
    }
}

// Add entry to activity log
function addSimLog(message, type = 'info') {
    const logDiv = document.getElementById('simLogEntries');
    if (!logDiv) return;
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.style.cssText = 'padding: 8px 12px; margin-bottom: 5px; border-radius: 4px; font-size: 14px;';
    
    // Color code based on type
    if (type === 'success') {
        entry.style.background = '#d4edda';
        entry.style.color = '#155724';
    } else if (type === 'error') {
        entry.style.background = '#f8d7da';
        entry.style.color = '#721c24';
    } else if (type === 'warning') {
        entry.style.background = '#fff3cd';
        entry.style.color = '#856404';
    } else {
        entry.style.background = '#d1ecf1';
        entry.style.color = '#0c5460';
    }
    
    const timestamp = new Date().toLocaleTimeString();
    entry.textContent = `[${timestamp}] ${message}`;
    logDiv.insertBefore(entry, logDiv.firstChild);
}

// Play Round 1
async function playRound1Btn() {
    try {
        addSimLog('Starting Round 1...', 'info');
        const result = await playRound1();
        
        const wdNames = result.withdrawals.map(w => w.name).join(', ');
        addSimLog(`Round 1 complete! ${result.withdrawals.length} withdrawal(s): ${wdNames || 'None'}`, 'success');
        
        await updateSimulatorStatus();
        showStatus('Round 1 complete!', 'success');
    } catch (error) {
        console.error('Error in Round 1:', error);
        addSimLog(`Error: ${error.message}`, 'error');
        showStatus(error.message, 'error');
    }
}

// Play Round 2
async function playRound2Btn() {
    try {
        addSimLog('Starting Round 2...', 'info');
        const result = await playRound2();
        
        const wdNames = result.withdrawals.map(w => w.name).join(', ');
        addSimLog(`Round 2 complete! ${result.withdrawals.length} withdrawal(s): ${wdNames || 'None'}`, 'success');
        addSimLog(`Cut line: ${result.cutLine}. ${result.madeCount} players made the cut.`, 'info');
        
        await updateSimulatorStatus();
        showStatus('Round 2 complete! Cut applied.', 'success');
    } catch (error) {
        console.error('Error in Round 2:', error);
        addSimLog(`Error: ${error.message}`, 'error');
        showStatus(error.message, 'error');
    }
}

// Play Round 3
async function playRound3Btn() {
    try {
        addSimLog('Starting Round 3...', 'info');
        const result = await playRound3();
        
        addSimLog(`Round 3 complete! ${result.playersPlayed} players finished the round.`, 'success');
        
        await updateSimulatorStatus();
        showStatus('Round 3 complete!', 'success');
    } catch (error) {
        console.error('Error in Round 3:', error);
        addSimLog(`Error: ${error.message}`, 'error');
        showStatus(error.message, 'error');
    }
}

// Play Round 4
async function playRound4Btn() {
    try {
        addSimLog('Starting Round 4 (Final Round)...', 'info');
        const result = await playRound4();
        
        addSimLog(`🏆 Tournament complete! Winner: ${result.winner.name} (${result.winner.total})`, 'success');
        addSimLog(`${result.playersPlayed} players completed the final round.`, 'info');
        
        await updateSimulatorStatus();
        showStatus(`Tournament complete! Winner: ${result.winner.name}`, 'success');
    } catch (error) {
        console.error('Error in Round 4:', error);
        addSimLog(`Error: ${error.message}`, 'error');
        showStatus(error.message, 'error');
    }
}

// Calculate Payouts
async function calculatePayoutsBtn() {
    try {
        addSimLog('Calculating tournament payouts...', 'info');
        const purse = 10000000; // $10M test tournament
        const result = await calculatePayouts(purse);
        
        addSimLog(`💰 Payouts calculated! Winner earns $${result.winnerEarnings.toLocaleString()}`, 'success');
        addSimLog(`Total paid: $${result.totalPaid.toLocaleString()} to ${result.playersPaid} players`, 'info');
        
        await updateSimulatorStatus();
        showStatus('Payouts calculated successfully!', 'success');
    } catch (error) {
        console.error('Error calculating payouts:', error);
        addSimLog(`Error: ${error.message}`, 'error');
        showStatus(error.message, 'error');
    }
}

// Reset Simulator
async function resetSimulatorBtn() {
    if (!confirm('⚠️ This will reset the entire tournament simulation. User picks will be preserved. Continue?')) {
        return;
    }
    
    try {
        addSimLog('Resetting tournament simulation...', 'warning');
        await resetTournament();
        
        addSimLog('✅ Tournament reset complete! Ready to simulate again.', 'success');
        await updateSimulatorStatus();
        showStatus('Tournament reset successfully!', 'success');
        
        // Clear the log
        const logDiv = document.getElementById('simLogEntries');
        if (logDiv) {
            logDiv.innerHTML = '';
        }
    } catch (error) {
        console.error('Error resetting tournament:', error);
        addSimLog(`Error: ${error.message}`, 'error');
        showStatus(error.message, 'error');
    }
}

// Initialize simulator display (call this when admin tab loads)
async function initializeSimulator() {
    await updateSimulatorStatus();
    addSimLog('Simulator ready. Use controls above to simulate tournament rounds.', 'info');
}
