let randomList = [
    'abcde',
    'bcdea',
    'cdeab',
    'deabc'
]

module.exports = {
    randomizer: () => {
        const random = (val1, val2) => {
            return Math.random() * (val1 - val2) + val2
        }
        
        const check = randomList[Math.floor(random(1, 5))-1]
        
        if (randomList.includes(check)) {
            return check
        }
    }
}