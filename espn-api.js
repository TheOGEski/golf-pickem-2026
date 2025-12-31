// ============================================
// ESPN GOLF API INTEGRATION
// ============================================

const ESPN_API = {
    baseUrl: 'https://site.api.espn.com/apis/site/v2/sports/golf/pga',
    
    // Fetch current scoreboard
    async fetchScoreboard() {
        try {
            const response = await fetch(`${this.baseUrl}/scoreboard`);
            if (!response.ok) throw new Error('Failed to fetch scoreboard');
            return await response.json();
        } catch (error) {
            console.error('Error fetching scoreboard:', error);
            return null;
        }
    },
    
    // Fetch specific tournament by ESPN ID
    async fetchTournament(espnId) {
        try {
            const response = await fetch(`${this.baseUrl}/events/${espnId}`);
            if (!response.ok) throw new Error(`Failed to fetch tournament ${espnId}`);
            const data = await response.json();
            return this.parseTournamentData(data);
        } catch (error) {
            console.error(`Error fetching tournament ${espnId}:`, error);
            return null;
        }
    },
    
    // Fetch tournament leaderboard
    async fetchLeaderboard(espnId) {
        try {
            const response = await fetch(`${this.baseUrl}/events/${espnId}/leaderboard`);
            if (!response.ok) throw new Error(`Failed to fetch leaderboard ${espnId}`);
            const data = await response.json();
            return this.parseLeaderboard(data);
        } catch (error) {
            console.error(`Error fetching leaderboard ${espnId}:`, error);
            return null;
        }
    },
    
    // Fetch tournament competitors (player field)
    async fetchCompetitors(espnId) {
        try {
            const response = await fetch(`${this.baseUrl}/events/${espnId}`);
            if (!response.ok) throw new Error(`Failed to fetch competitors ${espnId}`);
            const data = await response.json();
            return this.parseCompetitors(data);
        } catch (error) {
            console.error(`Error fetching competitors ${espnId}:`, error);
            return null;
        }
    },
    
    // Parse tournament data
    parseTournamentData(data) {
        if (!data || !data.event) return null;
        
        const event = data.event;
        const competition = event.competitions && event.competitions[0];
        const venue = competition?.venue;
        
        let location = '';
        if (venue?.address) {
            const parts = [];
            if (venue.address.city) parts.push(venue.address.city);
            if (venue.address.state) parts.push(venue.address.state);
            if (venue.address.country && !venue.address.state) parts.push(venue.address.country);
            location = parts.join(', ');
        }
        
        return {
            id: event.id,
            name: event.name || event.shortName,
            shortName: event.shortName,
            startDate: event.date,
            endDate: competition?.endDate || event.date,
            status: competition?.status?.type?.name || 'scheduled',
            completed: competition?.status?.type?.completed || false,
            venue: venue?.fullName || '',
            location: location
        };
    },
    
    // Parse competitors (player field)
    parseCompetitors(data) {
        if (!data || !data.event || !data.event.competitions) return [];
        
        const competition = data.event.competitions[0];
        if (!competition || !competition.competitors) return [];
        
        return competition.competitors.map(comp => {
            const athlete = comp.athlete || {};
            
            return {
                id: athlete.id || comp.id,
                playerId: athlete.id || comp.id,
                name: athlete.displayName || athlete.fullName || '',
                displayName: athlete.displayName || '',
                fullName: athlete.fullName || '',
                shortName: athlete.shortName || '',
                nationality: this.getNationality(athlete),
                country: this.getNationality(athlete),
                flag: athlete.flag || null,
                score: comp.score || 0,
                position: comp.order || null,
                status: comp.status?.type?.name || 'active'
            };
        }).filter(player => player.id); // Remove any invalid entries
    },
    
    // Parse leaderboard with earnings
    parseLeaderboard(data) {
        if (!data || !data.event || !data.event.competitions) return [];
        
        const competition = data.event.competitions[0];
        if (!competition || !competition.competitors) return [];
        
        return competition.competitors.map(comp => {
            const athlete = comp.athlete || {};
            
            // Calculate earnings (this is approximate - ESPN doesn't always provide exact earnings)
            const earnings = this.calculateEarnings(comp, competition);
            
            return {
                id: athlete.id || comp.id,
                playerId: athlete.id || comp.id,
                name: athlete.displayName || athlete.fullName || '',
                displayName: athlete.displayName || '',
                position: comp.order || null,
                score: comp.score || 0,
                totalScore: comp.score || 0,
                earnings: earnings,
                status: comp.status?.type?.name || 'active',
                cutStatus: this.determineCutStatus(comp),
                rounds: this.parseRounds(comp.linescores || [])
            };
        }).sort((a, b) => (a.position || 999) - (b.position || 999));
    },
    
    // Calculate earnings based on position (approximate)
    calculateEarnings(competitor, competition) {
        // This is an approximation - real earnings would come from PGA Tour official data
        // For now, return 0 - admin can manually update if needed
        return 0;
    },
    
    // Determine if player made the cut
    determineCutStatus(competitor) {
        const status = competitor.status?.type?.name || '';
        
        if (status === 'STATUS_CUT' || status.includes('CUT')) {
            return 'missed';
        }
        
        if (status === 'STATUS_WITHDRAWN' || status === 'WD') {
            return 'withdrawn';
        }
        
        if (status === 'STATUS_DISQUALIFIED' || status === 'DQ') {
            return 'disqualified';
        }
        
        return 'made';
    },
    
    // Parse round scores
    parseRounds(linescores) {
        if (!linescores || !Array.isArray(linescores)) return [];
        
        return linescores.map(line => {
            return {
                round: line.period || 0,
                score: line.value || 0,
                displayValue: line.displayValue || '0'
            };
        });
    },
    
    // Get nationality from athlete data
    getNationality(athlete) {
        if (!athlete) return '';
        
        if (athlete.flag && athlete.flag.alt) {
            return athlete.flag.alt;
        }
        
        return athlete.nationality || athlete.country || '';
    },
    
    // Fetch and cache tournament data
    async loadTournamentWithPlayers(espnId) {
        const tournament = await this.fetchTournament(espnId);
        const players = await this.fetchCompetitors(espnId);
        
        if (!tournament || !players) return null;
        
        return {
            ...tournament,
            players: players,
            playerCount: players.length
        };
    },
    
    // Auto-refresh leaderboard
    startAutoRefresh(espnId, intervalMinutes = 15, callback) {
        const intervalMs = intervalMinutes * 60 * 1000;
        
        const refreshData = async () => {
            console.log(`🔄 Auto-refreshing tournament ${espnId}...`);
            const leaderboard = await this.fetchLeaderboard(espnId);
            
            if (leaderboard && callback) {
                callback(leaderboard);
            }
            
            // Show refresh indicator
            const indicator = document.getElementById('autoRefreshIndicator');
            if (indicator) {
                indicator.classList.add('show');
                setTimeout(() => indicator.classList.remove('show'), 3000);
            }
        };
        
        // Initial load
        refreshData();
        
        // Set up interval
        return setInterval(refreshData, intervalMs);
    },
    
    // Stop auto-refresh
    stopAutoRefresh(intervalId) {
        if (intervalId) {
            clearInterval(intervalId);
        }
    },
    
    // Get PGA Tour calendar
    async fetchCalendar() {
        try {
            const response = await fetch(`${this.baseUrl}/scoreboard`);
            if (!response.ok) throw new Error('Failed to fetch calendar');
            const data = await response.json();
            
            if (data.leagues && data.leagues[0] && data.leagues[0].calendar) {
                return data.leagues[0].calendar;
            }
            
            return [];
        } catch (error) {
            console.error('Error fetching calendar:', error);
            return [];
        }
    },
    
    // Search for tournament by name
    async searchTournament(tournamentName) {
        const calendar = await this.fetchCalendar();
        
        if (!calendar || calendar.length === 0) return null;
        
        const searchTerm = tournamentName.toLowerCase();
        const found = calendar.find(event => {
            const label = (event.label || '').toLowerCase();
            return label.includes(searchTerm);
        });
        
        return found ? found.id : null;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ESPN_API;
}
