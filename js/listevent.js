
const startDate = new Date('2025-03-17');
const endDate = new Date('2025-05-18');
const daysOff = [ '2025-03-20', '2025-03-21', '2025-03-23', '2025-03-24', '2025-03-25', '2025-03-26', '2025-04-06', '2025-04-13', '2025-04-21', '2025-04-22', '2025-04-27', '2025-05-01', '2025-05-14', '2025-05-23', '2025-06-01', '2025-06-08', '2025-06-15', '2025-06-22', '2025-06-29', '2025-07-05', '2025-07-13', '2025-07-19', '2025-07-20', '2025-07-27', '2025-08-03', '2025-08-10', '2025-08-15', '2025-08-16', '2025-08-17', '2025-08-24' ];
const payments = [
    { date: '2025-03-27,', amount: 1500 }
];

let totalDaysOff = daysOff.length * 400;
let totalDaysWorked = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) - totalDaysOff;
let totalPayments = 0;

for (let payment of payments) {
    totalPayments += payment.amount;
}

let finalPayment = (totalDaysOff * 400) + (totalDaysWorked * 200) - totalPayments;

console.log('Final Payment:', finalPayment);
