const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.lead.createMany({
    data: [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@techcorp.in',
        phone: '9876543210',
        company: 'TechCorp India',
        source: 'website',
        status: 'new',
        score: 80
      },
      {
        name: 'Priya Sharma',
        email: 'priya@infosys.com',
        phone: '9876543211',
        company: 'Infosys Ltd',
        source: 'referral',
        status: 'contacted',
        score: 65
      },
      {
        name: 'Amit Patel',
        email: 'amit@wipro.com',
        phone: '9876543212',
        company: 'Wipro Technologies',
        source: 'cold_call',
        status: 'qualified',
        score: 90
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@tcs.com',
        phone: '9876543213',
        company: 'TCS',
        source: 'referral',
        status: 'new',
        score: 70
      }
    ]
  })

  console.log('✅ Test data created successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())