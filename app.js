function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            healthMonster: 100, 
            currentRound: 0,
            winner: null,
            logMessages: []
        }
    },
    watch: {
        playerHealth(value) {
            if(value < 0 && this.healthMonster <= 0) {
                // A draw
                this.winner = 'draw';
            } else if(value <= 0) {
                // player lost
                this.winner = 'monster';
            } 
        },
        healthMonster(value) {
            if(value < 0 && this.playerHealth <= 0) {
                // A draw
                this.winner = 'draw';
            } else if(value <= 0) {
                // Monster lost
                this.winner = 'player';
            } 
        }
    },
    computed: {
        monsterBarStyles() {
            if (this.healthMonster < 0) {
                return {width: '0%'};
            }
            return {width: this.healthMonster + '%'}
        },
        playerBarStyles() {
            if (this.playerHealth < 0) {
                return {width: '0%'};
            }
            return {width: this.playerHealth + '%'}
        },
        mayUseSpecialAttack() {
            return this.currentRound % 3 !== 0;
        },
        mayUseHealPlayer() {
            return this.currentRound % 4 !== 0;
        },
        

    },
    methods: {
        attackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(5, 12)
            this.healthMonster -= attackValue
            this.addLogMessage('player', 'attack', attackValue)
            this.attackPlayer();
            
        },
        attackPlayer() {
            const attackValue = getRandomValue(8, 15)
            this.addLogMessage('monster', 'attack', attackValue)
            this.playerHealth -= attackValue
        },
        specialAttackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(10, 25);
            this.healthMonster -= attackValue;
            this.addLogMessage('player', 'special-attack', attackValue)
            this.attackPlayer();
        },
        healPlayer() {
            this.currentRound++;
            const healValue = getRandomValue(5, 20);
            if(this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }
            this.addLogMessage('player', 'heal', healValue)
            this.attackPlayer()
        },
        startGame() {
            this.playerHealth = 100;
            this.healthMonster = 100;
            this.winner = null;
            this.currentRound = 0;
            this.logMessages = [];
        },
        surrender() {
            this.winner = 'monster'
        },
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            })
        }
    },
})

app.mount('#game')