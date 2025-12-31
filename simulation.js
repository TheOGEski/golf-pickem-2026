// ============================================
// TOURNAMENT SIMULATION ENGINE
// ============================================
// Simulates 4-round PGA Tour tournament with:
// - Realistic scoring
// - Random withdrawals (R1-R2)
// - Cut line calculation
// - PGA Tour payout structure
// ============================================

const TOURNAMENT_ID = 'test-tournament-2026';

// PGA Tour payout percentages (positions 1-70)
const PGA_PAYOUT_PERCENTAGES = {
    1: 18.0, 2: 10.9, 3: 6.9, 4: 4.9, 5: 4.1,
    6: 3.65, 7: 3.4, 8: 3.15, 9: 2.95, 10: 2.75,
    11: 2.55, 12: 2.35, 13: 2.15, 14: 1.95, 15: 1.85,
    16: 1.75, 17: 1.65, 18: 1.55, 19: 1.45, 20: 1.35,
    21: 1.25, 22: 1.17, 23: 1.09, 24: 1.01, 25: 0.95,
    26: 0.89, 27: 0.85, 28: 0.82, 29: 0.79, 30: 0.76,
    31: 0.73, 32: 0.70, 33: 0.67, 34: 0.65, 35: 0.63,
    36: 0.61, 37: 0.59, 38: 0.58, 39: 0.57, 40: 0.56,
    41: 0.55, 42: 0.54, 43: 0.53, 44: 0.52, 45: 0.51,
    46: 0.50, 47: 0.49, 48: 0.48, 49: 0.47, 50: 0.46,
    51: 0.45, 52: 0.44, 53: 0.43, 54: 0.42, 55: 0.41,
    56: 0.40, 57: 0.39, 58: 0.38, 59: 0.37, 60: 0.36,
    61: 0.35, 62: 0.34, 63: 0.33, 64: 0.32, 65: 0.31,
    66: 0.30, 67: 0.29, 68: 0.28, 69: 0.27, 70: 0.26
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Generate random score based on player ranking
function generateScore(playerIndex, round) {
    // Top 20 players: 65-70 range
    // Players 21-50: 67-72 range
    // Players 51-100: 68-73 range
    // Players 101-144: 69-76 range
    
    let min, max;
    if (playerIndex < 20) {
        min = 65; max = 70;
    } else if (playerIndex < 50) {
        min = 67; max = 72;
    } else if (playerIndex < 100) {
        min = 68; max = 73;
    } else {
        min = 69; max = 76;
    }
    
    // Add some variation for later rounds
    if (round > 2) {
        min -= 1;
        max -= 1;
    }
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Select random players for withdrawal
function selectWithdrawals(activePlayers, count) {
    const shuffled = [...activePlayers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Calculate cut line (typically top 70 and ties after R2)
function calculateCutLine(scores) {
    const sorted = Object.values(scores).sort((a, b) => a - b);
    const cutPosition = Math.min(70, sorted.length);
    return sorted[cutPosition - 1] || 0;
}

// ============================================
// ROUND SIMULATION FUNCTIONS
// ============================================

// Play Round 1
async function playRound1() {
    try {
        console.log('🏌️ Starting Round 1 simulation...');
        
        const players = getTestPlayers();
        const round1Data = {};
        const withdrawals = [];
        
        // Generate scores for all 144 players
        players.forEach((player, index) => {
            const score = generateScore(index, 1);
            round1Data[player.id] = {
                score: score,
                toPar: score - 72,
                status: 'active',
                playerName: player.displayName
            };
        });
        
        // Select 2-3 random withdrawals
        const wdCount = Math.floor(Math.random() * 2) + 2; // 2 or 3
        const wdPlayers = selectWithdrawals(players, wdCount);
        
        wdPlayers.forEach(player => {
            round1Data[player.id].status = 'WD';
            round1Data[player.id].wdRound = 1;
            withdrawals.push({
                id: player.id,
                name: player.displayName,
                round: 1
            });
        });
        
        // Save to Firebase
        await db.ref(`simulatedData/${TOURNAMENT_ID}/round1`).set(round1Data);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/withdrawals/round1`).set(withdrawals);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/currentRound`).set(1);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/status`).set('round1-complete');
        
        console.log(`✅ Round 1 complete: ${withdrawals.length} withdrawals`);
        return { round1Data, withdrawals };
        
    } catch (error) {
        console.error('❌ Error in playRound1:', error);
        throw error;
    }
}

// Play Round 2
async function playRound2() {
    try {
        console.log('🏌️ Starting Round 2 simulation...');
        
        // Get Round 1 data
        const round1Snapshot = await db.ref(`simulatedData/${TOURNAMENT_ID}/round1`).once('value');
        const round1Data = round1Snapshot.val();
        
        if (!round1Data) {
            throw new Error('Round 1 data not found. Please play Round 1 first.');
        }
        
        const round2Data = {};
        const cumulativeScores = {};
        const withdrawals = [];
        
        // Get active players from R1
        const activePlayers = Object.keys(round1Data).filter(
            playerId => round1Data[playerId].status === 'active'
        );
        
        // Generate R2 scores for active players
        const players = getTestPlayers();
        activePlayers.forEach(playerId => {
            const player = players.find(p => p.id === playerId);
            const playerIndex = players.indexOf(player);
            const r2Score = generateScore(playerIndex, 2);
            const r1Score = round1Data[playerId].score;
            
            round2Data[playerId] = {
                score: r2Score,
                toPar: r2Score - 72,
                cumulativeScore: r1Score + r2Score,
                cumulativeToPar: (r1Score + r2Score) - 144,
                status: 'active',
                playerName: player.displayName
            };
            
            cumulativeScores[playerId] = r1Score + r2Score;
        });
        
        // Select 2-3 more withdrawals from active players
        const activePlayerObjs = activePlayers.map(id => players.find(p => p.id === id));
        const wdCount = Math.floor(Math.random() * 2) + 2;
        const wdPlayers = selectWithdrawals(activePlayerObjs, wdCount);
        
        wdPlayers.forEach(player => {
            round2Data[player.id].status = 'WD';
            round2Data[player.id].wdRound = 2;
            withdrawals.push({
                id: player.id,
                name: player.displayName,
                round: 2
            });
        });
        
        // Calculate cut line
        const scoresForCut = Object.keys(round2Data)
            .filter(id => round2Data[id].status === 'active')
            .map(id => round2Data[id].cumulativeScore);
        
        const cutLine = calculateCutLine(scoresForCut);
        
        // Mark players who made/missed cut
        Object.keys(round2Data).forEach(playerId => {
            if (round2Data[playerId].status === 'active') {
                if (round2Data[playerId].cumulativeScore <= cutLine) {
                    round2Data[playerId].cutStatus = 'made';
                } else {
                    round2Data[playerId].cutStatus = 'missed';
                    round2Data[playerId].status = 'cut';
                }
            }
        });
        
        // Save to Firebase
        await db.ref(`simulatedData/${TOURNAMENT_ID}/round2`).set(round2Data);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/withdrawals/round2`).set(withdrawals);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/cutLine`).set(cutLine);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/currentRound`).set(2);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/status`).set('round2-complete');
        
        const madeCutCount = Object.values(round2Data).filter(p => p.cutStatus === 'made').length;
        console.log(`✅ Round 2 complete: Cut at ${cutLine - 144} (${madeCutCount} players made cut)`);
        
        return { round2Data, withdrawals, cutLine, madeCutCount };
        
    } catch (error) {
        console.error('❌ Error in playRound2:', error);
        throw error;
    }
}

// Play Round 3
async function playRound3() {
    try {
        console.log('🏌️ Starting Round 3 simulation...');
        
        // Get R1 and R2 data
        const round2Snapshot = await db.ref(`simulatedData/${TOURNAMENT_ID}/round2`).once('value');
        const round2Data = round2Snapshot.val();
        
        if (!round2Data) {
            throw new Error('Round 2 data not found. Please play Round 2 first.');
        }
        
        const round3Data = {};
        
        // Only players who made cut can play R3
        const madeCutPlayers = Object.keys(round2Data).filter(
            playerId => round2Data[playerId].cutStatus === 'made'
        );
        
        const players = getTestPlayers();
        madeCutPlayers.forEach(playerId => {
            const player = players.find(p => p.id === playerId);
            const playerIndex = players.indexOf(player);
            const r3Score = generateScore(playerIndex, 3);
            const cumulativeAfterR2 = round2Data[playerId].cumulativeScore;
            
            round3Data[playerId] = {
                score: r3Score,
                toPar: r3Score - 72,
                cumulativeScore: cumulativeAfterR2 + r3Score,
                cumulativeToPar: (cumulativeAfterR2 + r3Score) - 216,
                status: 'active',
                cutStatus: 'made',
                playerName: player.displayName
            };
        });
        
        // Save to Firebase
        await db.ref(`simulatedData/${TOURNAMENT_ID}/round3`).set(round3Data);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/currentRound`).set(3);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/status`).set('round3-complete');
        
        console.log(`✅ Round 3 complete: ${madeCutPlayers.length} players in contention`);
        
        return { round3Data };
        
    } catch (error) {
        console.error('❌ Error in playRound3:', error);
        throw error;
    }
}

// Play Round 4 (Final Round)
async function playRound4() {
    try {
        console.log('🏌️ Starting Round 4 (Final Round) simulation...');
        
        // Get R3 data
        const round3Snapshot = await db.ref(`simulatedData/${TOURNAMENT_ID}/round3`).once('value');
        const round3Data = round3Snapshot.val();
        
        if (!round3Data) {
            throw new Error('Round 3 data not found. Please play Round 3 first.');
        }
        
        const round4Data = {};
        const finalScores = {};
        
        const players = getTestPlayers();
        Object.keys(round3Data).forEach(playerId => {
            const player = players.find(p => p.id === playerId);
            const playerIndex = players.indexOf(player);
            const r4Score = generateScore(playerIndex, 4);
            const cumulativeAfterR3 = round3Data[playerId].cumulativeScore;
            const finalScore = cumulativeAfterR3 + r4Score;
            
            round4Data[playerId] = {
                score: r4Score,
                toPar: r4Score - 72,
                finalScore: finalScore,
                finalToPar: finalScore - 288,
                status: 'finished',
                cutStatus: 'made',
                playerName: player.displayName
            };
            
            finalScores[playerId] = finalScore;
        });
        
        // Determine positions
        const sortedPlayers = Object.keys(finalScores).sort((a, b) => finalScores[a] - finalScores[b]);
        
        let currentPosition = 1;
        let currentScore = finalScores[sortedPlayers[0]];
        
        sortedPlayers.forEach((playerId, index) => {
            if (finalScores[playerId] !== currentScore) {
                currentPosition = index + 1;
                currentScore = finalScores[playerId];
            }
            round4Data[playerId].position = currentPosition;
        });
        
        const winner = players.find(p => p.id === sortedPlayers[0]);
        
        // Save to Firebase
        await db.ref(`simulatedData/${TOURNAMENT_ID}/round4`).set(round4Data);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/finalScores`).set(finalScores);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/winner`).set({
            id: winner.id,
            name: winner.displayName,
            score: finalScores[winner.id],
            toPar: finalScores[winner.id] - 288
        });
        await db.ref(`simulatedData/${TOURNAMENT_ID}/currentRound`).set(4);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/status`).set('completed');
        
        console.log(`🏆 Tournament Complete! Winner: ${winner.displayName} (${finalScores[winner.id] - 288})`);
        
        return { round4Data, winner, finalScores };
        
    } catch (error) {
        console.error('❌ Error in playRound4:', error);
        throw error;
    }
}

// ============================================
// PAYOUT CALCULATION
// ============================================

// Calculate payouts based on final positions
async function calculatePayouts(purse = 10000000) {
    try {
        console.log('💰 Calculating payouts...');
        
        // Get Round 4 data
        const round4Snapshot = await db.ref(`simulatedData/${TOURNAMENT_ID}/round4`).once('value');
        const round4Data = round4Snapshot.val();
        
        if (!round4Data) {
            throw new Error('Round 4 data not found. Please complete Round 4 first.');
        }
        
        const earnings = {};
        
        // Calculate earnings for each player based on position
        Object.keys(round4Data).forEach(playerId => {
            const position = round4Data[playerId].position;
            const percentage = PGA_PAYOUT_PERCENTAGES[position] || 0;
            const earning = Math.round((purse * percentage) / 100);
            
            earnings[playerId] = {
                position: position,
                percentage: percentage,
                earnings: earning,
                playerName: round4Data[playerId].playerName
            };
        });
        
        // Save to Firebase
        await db.ref(`simulatedData/${TOURNAMENT_ID}/earnings`).set(earnings);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/purse`).set(purse);
        
        const winnerEarnings = earnings[Object.keys(earnings)[0]];
        console.log(`✅ Payouts calculated. Winner earns: $${winnerEarnings.earnings.toLocaleString()}`);
        
        return { earnings, purse };
        
    } catch (error) {
        console.error('❌ Error in calculatePayouts:', error);
        throw error;
    }
}

// ============================================
// RESET FUNCTION
// ============================================

// Reset tournament simulation (preserves user picks)
async function resetTournament() {
    try {
        console.log('🔄 Resetting tournament simulation...');
        
        // Clear all simulation data
        await db.ref(`simulatedData/${TOURNAMENT_ID}`).remove();
        
        // Re-initialize with pre-tournament status
        await db.ref(`simulatedData/${TOURNAMENT_ID}/currentRound`).set(0);
        await db.ref(`simulatedData/${TOURNAMENT_ID}/status`).set('pre-tournament');
        
        console.log('✅ Tournament reset complete. User picks preserved.');
        
        return { success: true, message: 'Tournament reset successfully' };
        
    } catch (error) {
        console.error('❌ Error in resetTournament:', error);
        throw error;
    }
}

// ============================================
// GET SIMULATION STATUS
// ============================================

// Get current simulation status
async function getSimulationStatus() {
    try {
        const statusSnapshot = await db.ref(`simulatedData/${TOURNAMENT_ID}/status`).once('value');
        const roundSnapshot = await db.ref(`simulatedData/${TOURNAMENT_ID}/currentRound`).once('value');
        
        const status = statusSnapshot.val() || 'not-started';
        const currentRound = roundSnapshot.val() || 0;
        
        return { status, currentRound };
        
    } catch (error) {
        console.error('❌ Error getting simulation status:', error);
        return { status: 'error', currentRound: 0 };
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

console.log('✅ Tournament Simulation Engine loaded');
