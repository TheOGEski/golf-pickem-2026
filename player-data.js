// ============================================
// PLAYER DATA UTILITIES
// ============================================

// Player utilities for search, filter, and display
const PlayerData = {
    
    // Check if player is Canadian
    isCanadian: function(player) {
        if (!player) return false;
        const nationality = player.nationality || player.country || '';
        return nationality.toLowerCase().includes('can') || 
               nationality.toLowerCase().includes('canada');
    },
    
    // Format player name for display
    formatPlayerName: function(player) {
        if (!player) return '';
        return player.displayName || player.fullName || player.name || '';
    },
    
    // Get player ID
    getPlayerId: function(player) {
        if (!player) return null;
        return player.id || player.playerId || null;
    },
    
    // Search players by name
    searchPlayers: function(players, searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return players;
        }
        
        const term = searchTerm.toLowerCase();
        return players.filter(player => {
            const name = this.formatPlayerName(player).toLowerCase();
            return name.includes(term);
        });
    },
    
    // Sort players - by field order (ranking) or alphabetically
    sortPlayers: function(players, sortBy = 'ranking') {
        if (sortBy === 'alpha') {
            // Alphabetical sort
            return players.sort((a, b) => {
                const nameA = this.formatPlayerName(a);
                const nameB = this.formatPlayerName(b);
                return nameA.localeCompare(nameB);
            });
        } else {
            // Keep ESPN field order (typically by ranking)
            // Don't sort - ESPN provides them in ranking order
            return players;
        }
    },
    
    // Filter out already selected players
    filterAvailablePlayers: function(allPlayers, selectedPlayerIds) {
        if (!selectedPlayerIds || selectedPlayerIds.length === 0) {
            return allPlayers;
        }
        
        return allPlayers.filter(player => {
            const playerId = this.getPlayerId(player);
            return !selectedPlayerIds.includes(playerId);
        });
    },
    
    // Get player by ID
    getPlayerById: function(players, playerId) {
        if (!players || !playerId) return null;
        return players.find(player => this.getPlayerId(player) === playerId);
    },
    
    // Format player card HTML
    createPlayerCard: function(player, options = {}) {
        const {
            isSelected = false,
            isDisabled = false,
            badge = null,
            onClick = null
        } = options;
        
        const playerId = this.getPlayerId(player);
        const playerName = this.formatPlayerName(player);
        const isCanadian = this.isCanadian(player);
        
        let className = 'player-card';
        if (isSelected) className += ' selected';
        if (isDisabled) className += ' disabled';
        if (isCanadian) className += ' canadian';
        
        let badgeHTML = '';
        if (badge) {
            badgeHTML = `<span class="player-badge">${badge}</span>`;
        }
        
        let flagHTML = '';
        // Always show country code text for now (flag images not working reliably)
        if (player.nationality) {
            flagHTML = `<span class="country-code">${player.nationality}</span>`;
        }
        
        const card = document.createElement('div');
        card.className = className;
        card.dataset.playerId = playerId;
        
        card.innerHTML = `
            ${badgeHTML}
            ${flagHTML}
            <div class="player-name">${playerName}</div>
            ${isCanadian ? '<div class="canadian-indicator">🍁 Canadian</div>' : ''}
        `;
        
        if (onClick && !isDisabled) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => onClick(player));
        }
        
        return card;
    },
    
    // Create player grid
    createPlayerGrid: function(players, options = {}) {
        const {
            selectedPlayerIds = [],
            disabledPlayerIds = [],
            onPlayerClick = null,
            showSearch = true,
            getBadge = null
        } = options;
        
        const container = document.createElement('div');
        container.className = 'player-grid-container';
        
        // Add search if enabled
        if (showSearch) {
            const searchBox = document.createElement('input');
            searchBox.type = 'text';
            searchBox.className = 'player-search';
            searchBox.placeholder = '🔍 Search players...';
            
            searchBox.addEventListener('input', (e) => {
                const searchTerm = e.target.value;
                const filtered = this.searchPlayers(players, searchTerm);
                updateGrid(filtered);
            });
            
            container.appendChild(searchBox);
        }
        
        // Create grid
        const grid = document.createElement('div');
        grid.className = 'player-grid';
        container.appendChild(grid);
        
        const updateGrid = (playersToShow) => {
            grid.innerHTML = '';
            
            if (playersToShow.length === 0) {
                grid.innerHTML = '<p class="no-players">No players found</p>';
                return;
            }
            
            playersToShow.forEach(player => {
                const playerId = this.getPlayerId(player);
                const isSelected = selectedPlayerIds.includes(playerId);
                const isDisabled = disabledPlayerIds.includes(playerId);
                const badge = getBadge ? getBadge(player) : null;
                
                const card = this.createPlayerCard(player, {
                    isSelected,
                    isDisabled,
                    badge,
                    onClick: onPlayerClick
                });
                
                grid.appendChild(card);
            });
        };
        
        updateGrid(players);
        
        return container;
    },
    
    // Validate pick structure
    validatePicks: function(picks) {
        const errors = [];
        
        if (!picks.winnerPick) {
            errors.push('Winner pick is required');
        }
        
        if (!picks.altWinner) {
            errors.push('Alternate winner is required');
        }
        
        if (!picks.alternate1) {
            errors.push('Alternate #1 is required');
        }
        
        if (!picks.alternate2) {
            errors.push('Alternate #2 is required');
        }
        
        if (!picks.tiebreaker) {
            errors.push('Tiebreaker is required');
        }
        
        if (!picks.basePlayers || picks.basePlayers.length !== 10) {
            errors.push('Must select exactly 10 base team players');
        }
        
        // Check for duplicates
        const allPicks = [
            picks.winnerPick,
            picks.altWinner,
            picks.alternate1,
            picks.alternate2,
            picks.tiebreaker,
            ...(picks.basePlayers || [])
        ].filter(p => p);
        
        const uniquePicks = new Set(allPicks);
        if (allPicks.length !== uniquePicks.size) {
            errors.push('Cannot select the same player multiple times');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlayerData;
}
