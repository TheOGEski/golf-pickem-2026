// ============================================
// WIZARD - 6-STEP PICK FLOW
// Part 1: Initialize & Step 1 (Winner Pick)
// ============================================

// Initialize the wizard
function initializeWizard() {
    const container = document.getElementById('wizardContainer');
    
    if (!tournamentPlayers || tournamentPlayers.length === 0) {
        container.innerHTML = '<div class="error-message">No players available for this tournament. Contact admin.</div>';
        return;
    }
    
    container.classList.remove('hidden');
    renderWizardStep();
}

// Render current wizard step
function renderWizardStep() {
    const container = document.getElementById('wizardContainer');
    
    // Create persistent picks summary at the top
    renderPicksSummaryPanel();
    
    switch(wizardState.step) {
        case 1:
            renderStep1_WinnerPick(container);
            break;
        case 2:
            renderStep2_AltWinner(container);
            break;
        case 3:
            renderStep3_BaseTeam(container);
            break;
        case 4:
            renderStep4_Alt1(container);
            break;
        case 5:
            renderStep5_Alt2(container);
            break;
        case 6:
            renderStep6_Tiebreaker(container);
            break;
        default:
            renderStep1_WinnerPick(container);
    }
}

// Scroll to picks summary
function scrollToPicksSummary() {
    const summaryDiv = document.getElementById('picksSummary');
    if (summaryDiv && !summaryDiv.classList.contains('hidden')) {
        summaryDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Render persistent picks summary panel
function renderPicksSummaryPanel() {
    const summaryDiv = document.getElementById('picksSummary');
    if (!summaryDiv) return;
    
    const getPlayerNameById = (playerId) => {
        if (!playerId) return '<em style="color: #999;">Not selected</em>';
        const player = tournamentPlayers.find(p => PlayerData.getPlayerId(p) === playerId);
        return player ? PlayerData.formatPlayerName(player) : playerId;
    };
    
    const baseTeamCount = wizardState.basePlayers ? wizardState.basePlayers.length : 0;
    const isComplete = wizardState.winnerPick && wizardState.altWinner && 
                       wizardState.alternate1 && wizardState.alternate2 && 
                       wizardState.tiebreaker && baseTeamCount === 10;
    
    let html = '<h3>Your Current Selections</h3>';
    html += '<div class="picks-grid">';
    
    // Winner Pick
    html += `<div class="pick-item ${wizardState.winnerPick ? 'completed' : ''}">
        <strong>⭐ Winner Pick:</strong> 
        <span class="pick-value ${wizardState.winnerPick ? 'editable' : ''}" 
              onclick="${wizardState.winnerPick ? 'editPick(1)' : ''}">
            ${getPlayerNameById(wizardState.winnerPick)}
        </span>
    </div>`;
    
    // Alternate Winner
    html += `<div class="pick-item ${wizardState.altWinner ? 'completed' : ''}">
        <strong>🔄 Alt. Winner:</strong> 
        <span class="pick-value ${wizardState.altWinner ? 'editable' : ''}" 
              onclick="${wizardState.altWinner ? 'editPick(2)' : ''}">
            ${getPlayerNameById(wizardState.altWinner)}
        </span>
    </div>`;
    
    // Base Team Count
    html += `<div class="pick-item ${baseTeamCount === 10 ? 'completed' : ''}">
        <strong>🏌️ Base Team:</strong> 
        <span class="pick-value ${baseTeamCount > 0 ? 'editable' : ''}" 
              onclick="${baseTeamCount > 0 ? 'editPick(3)' : ''}">
            ${baseTeamCount}/10 players selected
        </span>
    </div>`;
    
    // Alternate 1
    html += `<div class="pick-item ${wizardState.alternate1 ? 'completed' : ''}">
        <strong>🅰️ Alternate #1:</strong> 
        <span class="pick-value ${wizardState.alternate1 ? 'editable' : ''}" 
              onclick="${wizardState.alternate1 ? 'editPick(4)' : ''}">
            ${getPlayerNameById(wizardState.alternate1)}
        </span>
    </div>`;
    
    // Alternate 2
    html += `<div class="pick-item ${wizardState.alternate2 ? 'completed' : ''}">
        <strong>🅱️ Alternate #2:</strong> 
        <span class="pick-value ${wizardState.alternate2 ? 'editable' : ''}" 
              onclick="${wizardState.alternate2 ? 'editPick(5)' : ''}">
            ${getPlayerNameById(wizardState.alternate2)}
        </span>
    </div>`;
    
    // Tiebreaker
    html += `<div class="pick-item ${wizardState.tiebreaker ? 'completed' : ''}">
        <strong>🎯 Tiebreaker:</strong> 
        <span class="pick-value ${wizardState.tiebreaker ? 'editable' : ''}" 
              onclick="${wizardState.tiebreaker ? 'editPick(6)' : ''}">
            ${getPlayerNameById(wizardState.tiebreaker)}
        </span>
    </div>`;
    
    html += '</div>';
    
    // Show completion status
    if (isComplete) {
        html += '<div class="completion-status success">✅ All picks complete! Ready to save.</div>';
    } else {
        const remaining = [];
        if (!wizardState.winnerPick) remaining.push('Winner');
        if (!wizardState.altWinner) remaining.push('Alt Winner');
        if (!wizardState.alternate1) remaining.push('Alt #1');
        if (!wizardState.alternate2) remaining.push('Alt #2');
        if (!wizardState.tiebreaker) remaining.push('Tiebreaker');
        if (baseTeamCount < 10) remaining.push(`${10 - baseTeamCount} more base players`);
        
        html += `<div class="completion-status pending">⏳ Remaining: ${remaining.join(', ')}</div>`;
    }
    
    summaryDiv.innerHTML = html;
    summaryDiv.classList.remove('hidden');
}

// Edit a specific pick - jump to that step
function editPick(step) {
    wizardState.step = step;
    renderWizardStep();
    showStatus(`Editing step ${step}. Select a new player or go back.`, 'info');
}

// STEP 1: Select Winner Pick
function renderStep1_WinnerPick(container) {
    container.innerHTML = `
        <div class="wizard-step">
            <div class="wizard-header">
                <h2>Step 1 of 6: Select Your Winner Pick</h2>
                <p>Choose the player you think will WIN the tournament</p>
                <div class="wizard-progress">
                    <div class="progress-bar" style="width: 16.67%"></div>
                </div>
            </div>
            
            <div class="wizard-body">
                <div id="step1-players"></div>
            </div>
            
            <div class="wizard-footer">
                <p class="wizard-hint">⭐ This player will be your primary winner pick from your 10-person base team</p>
            </div>
        </div>
    `;
    
    // Create player grid
    const playersContainer = document.getElementById('step1-players');
    const sortedPlayers = PlayerData.sortPlayers([...tournamentPlayers], 'ranking');
    
    const grid = PlayerData.createPlayerGrid(sortedPlayers, {
        selectedPlayerIds: wizardState.winnerPick ? [wizardState.winnerPick] : [],
        onPlayerClick: selectWinnerPick,
        showSearch: true
    });
    
    playersContainer.appendChild(grid);
}

// Select winner pick
function selectWinnerPick(player) {
    const playerId = PlayerData.getPlayerId(player);
    wizardState.winnerPick = playerId;
    
    // Add to base players if not already there
    if (!wizardState.basePlayers.includes(playerId)) {
        wizardState.basePlayers = [playerId];
    }
    
    showStatus(`Winner pick selected: ${PlayerData.formatPlayerName(player)}`, 'success');
    
    // Auto-advance to step 2
    setTimeout(() => {
        wizardState.step = 2;
        renderWizardStep();
        scrollToPicksSummary();
    }, 500);
}

// STEP 2: Select Alternate Winner
function renderStep2_AltWinner(container) {
    const excludedIds = [wizardState.winnerPick];
    const availablePlayers = tournamentPlayers.filter(p => 
        !excludedIds.includes(PlayerData.getPlayerId(p))
    );
    
    container.innerHTML = `
        <div class="wizard-step">
            <div class="wizard-header">
                <h2>Step 2 of 6: Select Alternate Winner</h2>
                <p>This player replaces your Winner Pick if they withdraw before Round 1</p>
                <div class="wizard-progress">
                    <div class="progress-bar" style="width: 33.33%"></div>
                </div>
            </div>
            
            <div class="wizard-body">
                <div id="step2-players"></div>
            </div>
            
            <div class="wizard-footer">
                <button class="btn btn-secondary" onclick="goBackWizard()">← Back</button>
                <p class="wizard-hint">🔄 Backup winner from your 10-person base team</p>
            </div>
        </div>
    `;
    
    const playersContainer = document.getElementById('step2-players');
    const sortedPlayers = PlayerData.sortPlayers(availablePlayers);
    
    const grid = PlayerData.createPlayerGrid(sortedPlayers, {
        selectedPlayerIds: wizardState.altWinner ? [wizardState.altWinner] : [],
        onPlayerClick: selectAltWinner,
        showSearch: true
    });
    
    playersContainer.appendChild(grid);
}

function selectAltWinner(player) {
    const playerId = PlayerData.getPlayerId(player);
    wizardState.altWinner = playerId;
    
    if (!wizardState.basePlayers.includes(playerId)) {
        wizardState.basePlayers.push(playerId);
    }
    
    showStatus(`Alternate Winner selected: ${PlayerData.formatPlayerName(player)}`, 'success');
    
    setTimeout(() => {
        wizardState.step = 3;
        renderWizardStep();
        scrollToPicksSummary();
    }, 500);
}

// STEP 3: Complete Base Team (8 more players)
function renderStep3_BaseTeam(container) {
    // Exclude all special picks
    const excludedIds = [wizardState.winnerPick, wizardState.altWinner];
    const availablePlayers = tournamentPlayers.filter(p => 
        !excludedIds.includes(PlayerData.getPlayerId(p))
    );
    
    // How many more players needed (we already have 2 from winner + altWinner)
    const neededCount = 10 - wizardState.basePlayers.length;
    const selectedCount = wizardState.basePlayers.length - 2; // Exclude winner and altWinner
    
    container.innerHTML = `
        <div class="wizard-step">
            <div class="wizard-header">
                <h2>Step 3 of 6: Complete Your 10-Person Base Team</h2>
                <p>Select ${neededCount} more player${neededCount !== 1 ? 's' : ''} to complete your team (${selectedCount}/8 selected)</p>
                <div class="wizard-progress">
                    <div class="progress-bar" style="width: 50%"></div>
                </div>
            </div>
            
            <div class="wizard-body">
                <div id="step3-players"></div>
            </div>
            
            <div class="wizard-footer">
                <button class="btn btn-secondary" onclick="goBackWizard()">← Back</button>
                <button class="btn btn-primary" onclick="advanceFromBaseTeam()" ${wizardState.basePlayers.length < 10 ? 'disabled' : ''}>
                    Continue →
                </button>
                <p class="wizard-hint">🏌️ Select 8 more players to complete your 10-person base team</p>
            </div>
        </div>
    `;
    
    const playersContainer = document.getElementById('step3-players');
    const sortedPlayers = PlayerData.sortPlayers(availablePlayers);
    
    // Get base players excluding winner and altWinner
    const baseOnlyIds = wizardState.basePlayers.filter(id => 
        id !== wizardState.winnerPick && id !== wizardState.altWinner
    );
    
    const grid = PlayerData.createPlayerGrid(sortedPlayers, {
        selectedPlayerIds: baseOnlyIds,
        onPlayerClick: toggleBasePlayer,
        showSearch: true,
        multiSelect: true
    });
    
    playersContainer.appendChild(grid);
}

function advanceFromBaseTeam() {
    if (wizardState.basePlayers.length === 10) {
        wizardState.step = 4;
        renderWizardStep();
        scrollToPicksSummary();
    }
}

// STEP 4: Select Alternate #1
function renderStep4_Alt1(container) {
    // Exclude base team players
    const excludedIds = [...wizardState.basePlayers];
    const availablePlayers = tournamentPlayers.filter(p => 
        !excludedIds.includes(PlayerData.getPlayerId(p))
    );
    
    container.innerHTML = `
        <div class="wizard-step">
            <div class="wizard-header">
                <h2>Step 4 of 6: Select Alternate #1</h2>
                <p>Replaces any base player who withdraws before Round 1</p>
                <div class="wizard-progress">
                    <div class="progress-bar" style="width: 66.67%"></div>
                </div>
            </div>
            
            <div class="wizard-body">
                <div id="step4-players"></div>
            </div>
            
            <div class="wizard-footer">
                <button class="btn btn-secondary" onclick="goBackWizard()">← Back</button>
                <p class="wizard-hint">🅰️ First alternate replacement (NOT part of your 10-person base team)</p>
            </div>
        </div>
    `;
    
    const playersContainer = document.getElementById('step4-players');
    const sortedPlayers = PlayerData.sortPlayers(availablePlayers);
    
    const grid = PlayerData.createPlayerGrid(sortedPlayers, {
        selectedPlayerIds: wizardState.alternate1 ? [wizardState.alternate1] : [],
        onPlayerClick: selectAlternate1,
        showSearch: true
    });
    
    playersContainer.appendChild(grid);
}

function selectAlternate1(player) {
    const playerId = PlayerData.getPlayerId(player);
    wizardState.alternate1 = playerId;
    
    showStatus(`Alternate #1 selected: ${PlayerData.formatPlayerName(player)}`, 'success');
    
    setTimeout(() => {
        wizardState.step = 5;
        renderWizardStep();
        scrollToPicksSummary();
    }, 500);
}

// STEP 5: Select Alternate #2
function renderStep5_Alt2(container) {
    const excludedIds = [...wizardState.basePlayers, wizardState.alternate1];
    const availablePlayers = tournamentPlayers.filter(p => 
        !excludedIds.includes(PlayerData.getPlayerId(p))
    );
    
    container.innerHTML = `
        <div class="wizard-step">
            <div class="wizard-header">
                <h2>Step 5 of 6: Select Alternate #2</h2>
                <p>Second replacement if Alt.1 is also used</p>
                <div class="wizard-progress">
                    <div class="progress-bar" style="width: 83.33%"></div>
                </div>
            </div>
            
            <div class="wizard-body">
                <div id="step5-players"></div>
            </div>
            
            <div class="wizard-footer">
                <button class="btn btn-secondary" onclick="goBackWizard()">← Back</button>
                <p class="wizard-hint">🅱️ Second alternate replacement (NOT part of your 10-person base team)</p>
            </div>
        </div>
    `;
    
    const playersContainer = document.getElementById('step5-players');
    const sortedPlayers = PlayerData.sortPlayers(availablePlayers);
    
    const grid = PlayerData.createPlayerGrid(sortedPlayers, {
        selectedPlayerIds: wizardState.alternate2 ? [wizardState.alternate2] : [],
        onPlayerClick: selectAlternate2,
        showSearch: true
    });
    
    playersContainer.appendChild(grid);
}

function selectAlternate2(player) {
    const playerId = PlayerData.getPlayerId(player);
    wizardState.alternate2 = playerId;
    
    showStatus(`Alternate #2 selected: ${PlayerData.formatPlayerName(player)}`, 'success');
    
    setTimeout(() => {
        wizardState.step = 6;
        renderWizardStep();
        scrollToPicksSummary();
    }, 500);
}

// STEP 6: Select Tiebreaker (FINAL STEP - now includes save)
function renderStep6_Tiebreaker(container) {
    const excludedIds = [...wizardState.basePlayers, wizardState.alternate1, wizardState.alternate2];
    const availablePlayers = tournamentPlayers.filter(p => 
        !excludedIds.includes(PlayerData.getPlayerId(p))
    );
    
    container.innerHTML = `
        <div class="wizard-step">
            <div class="wizard-header">
                <h2>Step 6 of 6: Select Tiebreaker Player</h2>
                <p>This player's finish position breaks ties in season standings</p>
                <div class="wizard-progress">
                    <div class="progress-bar" style="width: 100%"></div>
                </div>
            </div>
            
            <div class="wizard-body">
                <div id="step6-players"></div>
            </div>
            
            <div class="wizard-footer">
                <button class="btn btn-secondary" onclick="goBackWizard()">← Back</button>
                <button class="btn btn-primary" onclick="savePicksToFirebase()" ${!wizardState.tiebreaker ? 'disabled' : ''}>
                    💾 Save My Picks
                </button>
                <p class="wizard-hint">🎯 Used to break ties in standings (NOT part of your 10-person base team)</p>
            </div>
        </div>
    `;
    
    const playersContainer = document.getElementById('step6-players');
    const sortedPlayers = PlayerData.sortPlayers(availablePlayers);
    
    const grid = PlayerData.createPlayerGrid(sortedPlayers, {
        selectedPlayerIds: wizardState.tiebreaker ? [wizardState.tiebreaker] : [],
        onPlayerClick: selectTiebreaker,
        showSearch: true
    });
    
    playersContainer.appendChild(grid);
}

function selectTiebreaker(player) {
    const playerId = PlayerData.getPlayerId(player);
    wizardState.tiebreaker = playerId;
    
    showStatus(`Tiebreaker selected: ${PlayerData.formatPlayerName(player)}. Review your picks!`, 'success');
    
    // Auto-advance to review step - update summary immediately
    setTimeout(() => {
        showFinalReview();
        // Force summary refresh after review screen is shown
        setTimeout(() => {
            renderPicksSummaryPanel();
        }, 100);
    }, 500);
}

// Show final review before save
function showFinalReview() {
    const wizardContainer = document.getElementById('wizardContainer');
    
    wizardContainer.innerHTML = `
        <div class="wizard-step">
            <div class="wizard-header">
                <h2>✅ All Picks Complete!</h2>
                <p>Review your selections before locking them in</p>
            </div>
            
            <div class="wizard-body">
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                    <strong>💡 Review Your Picks:</strong>
                    <p style="margin-top: 10px; margin-bottom: 0;">Click on any pick in the "Your Current Selections" section above to make changes before locking in your team.</p>
                </div>
            </div>
            
            <div class="wizard-footer" style="text-align: center;">
                <button class="btn btn-primary" onclick="savePicksToFirebase()" style="font-size: 18px; padding: 16px 40px;">
                    🔒 Lock In My Picks
                </button>
            </div>
        </div>
    `;
    
    // Scroll to picks summary for review
    scrollToPicksSummary();
}

function toggleBasePlayer(player) {
    const playerId = PlayerData.getPlayerId(player);
    const baseOnlyPlayers = wizardState.basePlayers.filter(id => 
        id !== wizardState.winnerPick && id !== wizardState.altWinner
    );
    
    if (baseOnlyPlayers.includes(playerId)) {
        // Remove from base players
        wizardState.basePlayers = wizardState.basePlayers.filter(id => id !== playerId);
        showStatus(`Removed ${PlayerData.formatPlayerName(player)}`, 'info');
        // Re-render to update button state
        renderWizardStep();
    } else {
        // Add to base players (max 10 total)
        if (wizardState.basePlayers.length < 10) {
            wizardState.basePlayers.push(playerId);
            const newCount = wizardState.basePlayers.length;
            showStatus(`Added ${PlayerData.formatPlayerName(player)} (${newCount}/10)`, 'success');
            
            // Check if base team is complete
            if (newCount === 10) {
                // Auto-advance to step 4 when 10th player selected
                setTimeout(() => {
                    wizardState.step = 4;
                    renderWizardStep();
                    scrollToPicksSummary();
                }, 500);
            } else {
                // Just re-render to update count
                renderWizardStep();
                setTimeout(() => {
                    const wizardContainer = document.getElementById('wizardContainer');
                    if (wizardContainer) {
                        wizardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        } else {
            showStatus('You already have 10 base players selected', 'warning');
        }
    }
}

// Save picks to Firebase
async function savePicksToFirebase() {
    if (!currentUser || !currentTournament) {
        showStatus('Error: Not logged in or no tournament selected', 'error');
        return;
    }
    
    if (wizardState.basePlayers.length !== 10) {
        showStatus('Please select exactly 10 base players', 'error');
        return;
    }
    
    // Validate all picks are set
    if (!wizardState.winnerPick || !wizardState.altWinner || !wizardState.alternate1 || 
        !wizardState.alternate2 || !wizardState.tiebreaker) {
        showStatus('Please complete all steps before saving', 'error');
        return;
    }
    
    showStatus('Saving your picks...', 'info');
    
    const picks = {
        winnerPick: wizardState.winnerPick,
        altWinner: wizardState.altWinner,
        alternate1: wizardState.alternate1,
        alternate2: wizardState.alternate2,
        tiebreaker: wizardState.tiebreaker,
        basePlayers: wizardState.basePlayers,
        submittedAt: new Date().toISOString(),
        tournamentId: currentTournament.id,
        tournamentName: currentTournament.name
    };
    
    try {
        await db.ref(`picks/${currentUser}/${currentTournament.id}`).set(picks);
        showStatus('✅ Picks locked in successfully! Redirecting to Dashboard...', 'success');
        
        // Redirect to dashboard after save
        setTimeout(() => {
            switchTab('dashboard', { target: document.querySelector('.nav-tab:nth-child(2)') });
        }, 1500);
        
    } catch (error) {
        console.error('Error saving picks:', error);
        showStatus('Error saving picks. Please try again.', 'error');
    }
}

// Show picks summary after saving
function showPicksSummary() {
    const container = document.getElementById('wizardContainer');
    
    const getPlayerNameById = (playerId) => {
        const player = tournamentPlayers.find(p => PlayerData.getPlayerId(p) === playerId);
        return player ? PlayerData.formatPlayerName(player) : playerId;
    };
    
    container.innerHTML = `
        <div class="wizard-step">
            <div class="wizard-header">
                <h2>✅ Picks Saved Successfully!</h2>
                <p>Your team for ${currentTournament.name}</p>
            </div>
            
            <div class="wizard-body">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <h3>Your Selections:</h3>
                    
                    <div style="margin: 15px 0;">
                        <p><strong>⭐ Winner Pick:</strong> ${getPlayerNameById(wizardState.winnerPick)}</p>
                        <p><strong>🔄 Alternate Winner:</strong> ${getPlayerNameById(wizardState.altWinner)}</p>
                        <p><strong>🅰️ Alternate #1:</strong> ${getPlayerNameById(wizardState.alternate1)}</p>
                        <p><strong>🅱️ Alternate #2:</strong> ${getPlayerNameById(wizardState.alternate2)}</p>
                        <p><strong>🎯 Tiebreaker:</strong> ${getPlayerNameById(wizardState.tiebreaker)}</p>
                    </div>
                    
                    <div style="margin: 15px 0;">
                        <p><strong>🏌️ Base Team (10 players):</strong></p>
                        <ul style="column-count: 2; margin-top: 10px;">
                            ${wizardState.basePlayers.map(id => `<li>${getPlayerNameById(id)}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 15px; background: #d1ecf1; border-radius: 6px; color: #0c5460;">
                        <strong>💡 Next Steps:</strong>
                        <ul style="margin-top: 10px; margin-left: 20px;">
                            <li>View your team in the Dashboard tab</li>
                            <li>Check Season Standings to see how you compare</li>
                            <li>You can edit your picks until the deadline</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="wizard-footer">
                <button class="btn btn-primary" onclick="switchTab('dashboard')">View Dashboard</button>
                <button class="btn btn-secondary" onclick="editPicks()">Edit My Picks</button>
            </div>
        </div>
    `;
}

// Edit picks - restart wizard
function editPicks() {
    wizardState.step = 1;
    renderWizardStep();
}

// Go back in wizard
function goBackWizard() {
    if (wizardState.step > 1) {
        wizardState.step--;
        renderWizardStep();
    }
}
