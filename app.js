function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function delay(fn, milliseconds = 300) {
  setTimeout(fn, milliseconds)
}

Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      playerTurn: true,
      currentRound: 0,
      canHeal: true,
      winner: undefined,
      logs: [],
    }
  },
  computed: {
    playerHealthbar() {
      if (this.playerHealth < 0) this.playerHealth = 0
      return { width: this.playerHealth + '%' }
    },
    monsterHealthbar() {
      if (this.monsterHealth < 0) this.monsterHealth = 0
      return { width: this.monsterHealth + '%' }
    },
    specialAttackAvailability() {
      return this.currentRound % 3 !== 0
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = 'Draw'
      } else if (value <= 0) {
        this.winner = 'Monster'
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = 'Draw'
      } else if (value <= 0) {
        this.winner = 'Player'
      }
    },
  },
  methods: {
    startNewGame() {
      this.playerHealth = 100
      this.monsterHealth = 100
      this.playerTurn = true
      this.currentRound = 0
      this.canHeal = true
      this.winner = undefined
      this.logs = []
    },
    attackMonster() {
      // block player actions
      this.playerTurn = false

      // increment round counter
      this.currentRound++

      // infer damage to monster
      const attackValue = getRandomValue(5, 12)
      this.monsterHealth -= attackValue

      this.addLogMessage('player', 'damage', attackValue)

      // pass the turn to monster
      delay(this.attackPlayer)
    },
    attackPlayer() {
      // infer damage to player
      const attackValue = getRandomValue(6, 18)
      this.playerHealth -= attackValue

      this.addLogMessage('monster', 'damage', attackValue)

      // pass the turn to player
      this.playerTurn = true
    },
    specialAttack() {
      // block player actions
      this.playerTurn = false

      // infer damage to monster
      const attackValue = getRandomValue(1, 50)
      this.monsterHealth -= attackValue

      this.addLogMessage('player', 'damage', attackValue)

      this.currentRound++

      // pass the turn to monster
      delay(this.attackPlayer)
      delay(this.attackPlayer, 600)
    },
    healPlayer() {
      // block player actions
      this.playerTurn = false

      // no more healing
      this.canHeal = false

      // infer damage to monster
      let healValue = getRandomValue(20, 40)
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100
      } else {
        this.playerHealth += healValue
      }

      this.addLogMessage('player', 'heal', healValue)

      delay(this.attackPlayer)
    },
    surrender() {
      this.addLogMessage('player', 'surrender', '0')
      this.winner = 'Monster'
    },
    addLogMessage(who, what, value) {
      this.logs.unshift({ who, what, value })
    },
  },
}).mount('#game')
