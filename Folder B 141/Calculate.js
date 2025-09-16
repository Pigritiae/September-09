function calculate() {
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;
    const days = [
        { in: 'monIn', out: 'monOut' },
        { in: 'tueOut', out: 'tueOut' },
        { in: 'wedOut', out: 'wedOut' },
        { in: 'thuOut', out: 'thuOut' },
        { in: 'friOut', out: 'friOut' }
    ];
    let totalHours = 0;
    let dailyEarnings = 0;
    let weeklyEarnings = 0;
    days.forEach(day => {
        const inTime = document.getElementById(day.in).value;
        const outTime = document.getElementById(day.out).value;
        if (inTime && outTime) {
            const inDate = new Date(`1970-01-01 ${inTime}`);
            const outDate = new Date(`1970-01-01 ${outTime}`);
            if (outDate > inDate) {
                const hours = (outDate - inDate) / (1000 * 60 * 60);
                totalHours += hours;
                const dailyEarn = hours * hourlyRate;
                dailyEarnings = dailyEarn;
                weeklyEarnings += dailyEarn;
            } 
        }
    });
    document.getElementById('totalHours').textContent = totalHours.toFixed(1);
    document.getElementById('dailyTotal').textContent = `R$ ${dailyEarnings.toFixed(2)}`;
    document.getElementById('weeklyTotal').textContent = `R$ ${weeklyEarnings.toFixed(2)}`;
}
document.getElementById('hourlyRate').addEventListener('input', calculate);
['monIn', 'monOut', 'tueIn', 'tueOut', 'wedIn', 'wedOut', 'thuIn', 'thuOut', 'friIn', 'friOut'].forEach(id => {
    document.getElementById(id).addEventListener('change', calculate);
});
calculate();