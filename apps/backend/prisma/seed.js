"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const CATEGORIES = [
    'ELECTRICAL',
    'WATER',
    'PLUMBING',
    'SECURITY',
    'PARKING',
    'LIFT',
    'CLEANING',
    'GARDEN',
    'NOISE',
    'OTHER',
];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'OVERDUE'];
const COMPLAINT_TITLES = {
    ELECTRICAL: ['Frequent power tripping in block', 'Flickering lights in corridor', 'Exposed wiring near meter room'],
    WATER: ['Low water pressure on upper floors', 'Water leakage from overhead tank', 'No hot water supply'],
    PLUMBING: ['Bathroom pipe leakage', 'Clogged drainage in kitchen', 'Sewage smell near basement'],
    SECURITY: ['Broken CCTV camera at gate', 'Unauthorized visitor entry', 'Intercom not working'],
    PARKING: ['Unauthorized vehicle parked in my slot', 'Visitor parking overflow', 'Parking gate sensor malfunction'],
    LIFT: ['Lift making unusual noise', 'Lift stuck between floors', 'Lift door not closing properly'],
    CLEANING: ['Garbage not collected for 3 days', 'Common area not cleaned', 'Staircase dirty and littered'],
    GARDEN: ['Garden lights not working', 'Overgrown bushes blocking pathway', 'Irrigation system leaking'],
    NOISE: ['Loud construction noise early morning', 'Neighbor playing loud music at night', 'Generator noise disturbance'],
    OTHER: ['Request for extra dustbin', 'Notice board glass broken', 'Clubhouse booking issue'],
};
function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomPastDate(maxDaysAgo) {
    const days = Math.floor(Math.random() * maxDaysAgo);
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}
async function main() {
    console.log('🌱 Seeding database...');
    await prisma.notification.deleteMany();
    await prisma.emailLog.deleteMany();
    await prisma.complaintHistory.deleteMany();
    await prisma.complaintImage.deleteMany();
    await prisma.complaint.deleteMany();
    await prisma.notice.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.prioritySettings.deleteMany();
    await prisma.systemSetting.deleteMany();
    await prisma.user.deleteMany();
    const passwordHash = await bcryptjs_1.default.hash('Password@123', 12);
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@societytracker.com',
            password: passwordHash,
            role: 'ADMIN',
            phone: '9999900000',
            isActive: true,
            emailVerified: true,
        },
    });
    const residentNames = [
        'Aarav Sharma',
        'Priya Mehta',
        'Rohan Verma',
        'Sneha Iyer',
        'Karan Malhotra',
        'Ananya Gupta',
        'Vikram Nair',
        'Neha Kapoor',
        'Aditya Joshi',
        'Ishita Rao',
    ];
    const residents = await Promise.all(residentNames.map((name, index) => prisma.user.create({
        data: {
            name,
            email: `resident${index + 1}@societytracker.com`,
            password: passwordHash,
            role: 'RESIDENT',
            phone: `98765${String(10000 + index).slice(-5)}`,
            flatNumber: `${String.fromCharCode(65 + (index % 4))}-${100 + index}`,
            block: String.fromCharCode(65 + (index % 4)),
            isActive: true,
            emailVerified: true,
        },
    })));
    await prisma.prioritySettings.createMany({
        data: [
            { priority: 'HIGH', overdueThresholdDays: 3 },
            { priority: 'MEDIUM', overdueThresholdDays: 7 },
            { priority: 'LOW', overdueThresholdDays: 15 },
        ],
    });
    await prisma.systemSetting.createMany({
        data: [
            { key: 'society_name', value: 'Greenwood Heights Society' },
            { key: 'support_email', value: 'support@societytracker.com' },
        ],
    });
    console.log(`✅ Created admin and ${residents.length} residents`);
    let created = 0;
    for (let i = 0; i < 50; i++) {
        const category = randomFrom(CATEGORIES);
        const priority = randomFrom(PRIORITIES);
        const status = randomFrom(STATUSES);
        const resident = randomFrom(residents);
        const createdAt = randomPastDate(60);
        const title = randomFrom(COMPLAINT_TITLES[category]);
        const isOverdue = status === 'OVERDUE';
        const complaint = await prisma.complaint.create({
            data: {
                ticketNumber: `SMT-${createdAt.getFullYear()}-${String(100000 + i)}`,
                title,
                description: `${title}. Reported by resident and requires attention from the maintenance team. Please look into this at the earliest convenience.`,
                category,
                priority,
                status,
                residentId: resident.id,
                assignedToId: status !== 'OPEN' ? admin.id : null,
                isOverdue,
                dueDate: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
                resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000) : null,
                closedAt: status === 'CLOSED' ? new Date(createdAt.getTime() + 5 * 24 * 60 * 60 * 1000) : null,
                internalNotes: status !== 'OPEN' ? 'Maintenance staff assigned and notified for resolution.' : null,
                createdAt,
                updatedAt: createdAt,
            },
        });
        await prisma.complaintHistory.create({
            data: {
                complaintId: complaint.id,
                actorId: resident.id,
                newStatus: 'OPEN',
                notes: 'Complaint created',
                createdAt,
            },
        });
        if (status !== 'OPEN') {
            await prisma.complaintHistory.create({
                data: {
                    complaintId: complaint.id,
                    actorId: admin.id,
                    oldStatus: 'OPEN',
                    newStatus: status,
                    notes: 'Status updated by admin',
                    createdAt: new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000),
                },
            });
        }
        created += 1;
    }
    console.log(`✅ Created ${created} complaints`);
    const noticeTitles = [
        'Annual General Meeting Scheduled',
        'Water Supply Maintenance Notice',
        'Diwali Celebration Committee Formed',
        'Parking Rules Update',
        'Society Painting Work Starting Next Week',
        'Lift Maintenance Downtime Notice',
        'New Security Guard Onboarding',
        'Fire Safety Drill Announcement',
        'Clubhouse Renovation Update',
        'Festive Season Decoration Guidelines',
        'Monthly Maintenance Fee Reminder',
        'Swimming Pool Cleaning Schedule',
        'Garden Area Beautification Project',
        'CCTV Upgrade Completed',
        'Rainwater Harvesting Initiative',
        'Society App Launch Announcement',
        'Power Backup Testing Notice',
        'Waste Segregation Guidelines',
        'Visitor Management Policy Update',
        'Republic Day Flag Hoisting Ceremony',
    ];
    for (let i = 0; i < noticeTitles.length; i++) {
        await prisma.notice.create({
            data: {
                title: noticeTitles[i],
                content: `Dear Residents, this is to inform you about "${noticeTitles[i]}". Please cooperate with the society management for smooth execution. For any queries, reach out to the management office.`,
                isPinned: i < 3,
                isImportant: i % 4 === 0,
                authorId: admin.id,
                createdAt: randomPastDate(45),
            },
        });
    }
    console.log(`✅ Created ${noticeTitles.length} notices`);
    console.log('🎉 Seeding completed successfully!');
    console.log('');
    console.log('Login credentials (all use password: Password@123)');
    console.log('  Admin:    admin@societytracker.com');
    console.log('  Resident: resident1@societytracker.com (through resident10@societytracker.com)');
}
main()
    .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map