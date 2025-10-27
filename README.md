# Kenyan Student Association Website

A full-stack web application for the Kenyan Student Association at the University of Minnesota, built with Next.js, TypeScript, Prisma, PostgreSQL, and Clerk authentication. The design aesthetic is inspired by modern sports websites (Chelsea FC's design system) featuring a bold blue and red color scheme.


## 🌟 Features

### Public-Facing Pages
- **Homepage**: Dynamic hero section with team photo, real-time statistics, upcoming events preview, and latest news
- **About**: Mission statement, values, and leadership team information
- **Events**: Comprehensive events listing with filtering (upcoming/past), detailed event pages, and registration links
- **News**: Latest news articles with category filtering and individual article pages
- **Blog**: Community blog posts with author information and category organization
- **Gallery**: Photo gallery with category filtering and lightbox modal for full-size viewing
- **Contact**: Contact form with real-time submission to admin dashboard and email notifications
- **Membership**: Free membership signup form with validation
- **Newsletter**: Email subscription page for community updates
- **Privacy Policy**: Comprehensive privacy policy for user data protection
- **Terms & Conditions**: Legal terms for website use and membership

### Authentication & Authorization
- **Clerk Integration**: Secure user authentication with sign-in/sign-up
- **Admin Role Management**: Admin access controlled via environment variables
- **Protected Routes**: Admin panel accessible only to authorized users
- **User Profiles**: Clerk-managed user profiles with UserButton component

### Admin Panel
- **Dashboard**: Centralized admin interface with tabbed navigation
- **Content Management**: Full CRUD operations for:
  - News articles
  - Blog posts
  - Events
  - Gallery images
- **Member Management**: View all registered members
- **Contact Messages**: View and manage contact form submissions with email notifications
- **Newsletter Subscribers**: View all newsletter subscribers
- **Role-Based Access**: Only users with admin IDs can access the panel

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Custom CSS Modules (no Tailwind or UI libraries)
- **Design**: Modern sports aesthetic inspired by Chelsea FC's design system (blue/red color scheme)
- **Authentication UI**: Clerk components (SignInButton, UserButton)

### Backend
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **API Routes**: Next.js API routes for all CRUD operations
- **Authentication**: Clerk for secure user authentication
- **Email**: Nodemailer with Gmail for contact form notifications

### Environment Variables

This project requires the following environment variables:

\`\`\`env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Admin Access Control
NEXT_PUBLIC_ADMIN_IDS="user_xxxxxxxxxxxxx,user_yyyyyyyyyyyyy"

# Email Notifications (Gmail via Nodemailer)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-16-character-app-password"
ADMIN_EMAIL="admin@ksa-umn.edu"
\`\`\`

**Setting up environment variables:**

1. **Database URL**: - **v0 Project**: [Continue Building](https://v0.app/chat/projects/

   - Provided automatically when you connect the Neon integration in v0
   - Format: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`

2. **Clerk Authentication**:
   - Sign up at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy the publishable key to `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Copy the secret key to `CLERK_SECRET_KEY`

3. **Admin Access Control**:
   - `NEXT_PUBLIC_ADMIN_IDS`: Comma-separated list of Clerk user IDs who should have admin access
   - To find your user ID: Sign in to your app, then check the Clerk dashboard under Users
   - Example: `"user_2abc123def,user_2xyz789ghi"`

4. **Email Notifications (Gmail)**:
   - `GMAIL_USER`: Your Gmail address (e.g., "yourname@gmail.com")
   - `GMAIL_APP_PASSWORD`: A 16-character app-specific password from Google
     - Go to your Google Account settings
     - Navigate to Security → 2-Step Verification → App passwords
     - Generate a new app password for "Mail"
     - Copy the 16-character password (no spaces)
   - `ADMIN_EMAIL`: The email address that should receive contact form notifications (can be the same as GMAIL_USER)

## 📁 Project Structure

\`\`\`
├── app/
│   ├── about/              # About page
│   ├── admin/              # Admin dashboard
│   │   └── components/     # Admin CRUD components
│   ├── api/                # API routes
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── events/
│   │   ├── gallery/
│   │   ├── membership/
│   │   ├── news/
│   │   ├── newsletter/
│   │   └── stats/
│   ├── blog/               # Blog pages
│   ├── contact/            # Contact page
│   ├── events/             # Events pages
│   ├── gallery/            # Gallery page
│   ├── membership/         # Membership signup
│   ├── news/               # News pages
│   ├── newsletter/         # Newsletter subscription
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms and conditions
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── header.tsx          # Site header with navigation
│   └── footer.tsx          # Site footer
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seed script
├── middleware.ts           # Clerk authentication middleware
└── public/
    └── images/
        └── hero-team.jpg   # Team hero image
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)
- Clerk account for authentication
- Gmail account with app password for email notifications

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/ksa-website.git
cd ksa-website
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
# Create a .env file in the root directory
DATABASE_URL="your_neon_database_url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_ADMIN_IDS="your_clerk_user_id"
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-16-character-app-password"
ADMIN_EMAIL="admin@ksa-umn.edu"
\`\`\`

4. Set up the database:
\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Admin Access

To access the admin panel:
1. Sign up/Sign in using Clerk authentication
2. Add your Clerk user ID to the `NEXT_PUBLIC_ADMIN_IDS` environment variable
3. Navigate to `/admin` - the Admin link will appear in the header
4. Manage content through the tabbed interface

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#034694` (inspired by Chelsea FC)
- **Accent Red**: `#dc2626` (inspired by Kenyan flag)
- **Dark Blue**: `#001f3f`
- **Light Blue**: `#e6f2ff`
- **Neutrals**: White, grays, black

### Typography
- **Headings**: System font stack with fallbacks
- **Body**: Optimized for readability with 1.6 line-height
- **Responsive**: Fluid typography scales with viewport

### Animations
- Smooth transitions on hover states
- Fade-in animations on page load
- Scale transforms for interactive elements
- Modal animations for gallery lightbox

## 🔄 Data Flow

1. **Client Request**: User visits a page (e.g., `/news`)
2. **API Call**: Page component fetches data from API route (e.g., `/api/news`)
3. **Database Query**: API route queries PostgreSQL via Prisma
4. **Response**: Data returned as JSON
5. **Render**: Component displays data with loading/error states

## 🔐 Security & Authentication

### Clerk Integration
- **Secure Authentication**: Industry-standard OAuth and session management
- **User Management**: Clerk handles user data, passwords, and security
- **Admin Role Checking**: User IDs compared against environment variable list
- **Protected Routes**: Admin panel checks authentication status before rendering

### Email Security
- **Server-Side Only**: Email sending happens only in API routes (server-side)
- **Gmail App Passwords**: Uses app-specific passwords instead of account password
- **Error Handling**: Email failures don't break the contact form submission

### Production Recommendations
1. **Secure Admin IDs**: Keep `NEXT_PUBLIC_ADMIN_IDS` list updated and secure
2. **Gmail Security**: Use app passwords, never your actual Gmail password
3. **Rate Limiting**: Add rate limiting to contact form API
4. **Input Validation**: Validate and sanitize all user inputs
5. **HTTPS**: Always use HTTPS in production (Vercel handles this automatically)

## 🔮 Future Enhancements

### Enhanced Features
- Email notifications for new events and news
- Member profiles and dashboards
- Event RSVP system with email confirmations
- Payment integration for paid events (Stripe)
- Social media integration
- Search functionality across all content
- Real-time chat or forums
- Multi-language support

### Technical Improvements
- Image optimization with Cloudinary
- CDN delivery for media assets
- Advanced caching strategies
- Analytics dashboard for admins
- Automated testing suite
- CI/CD pipeline improvements

## 📝 Development Notes

### Custom CSS Approach
This project uses custom CSS modules instead of Tailwind or UI libraries to:
- Maintain full design control
- Create unique, branded styling
- Optimize bundle size
- Learn CSS fundamentals

### API Design
- RESTful conventions
- Consistent error handling
- JSON responses
- HTTP status codes

### Database Schema
- Normalized relational design
- Timestamps for all records
- Unique constraints where appropriate
- Newsletter subscription tracking

### Code Organization
- Component-based architecture
- Separation of concerns
- Reusable utility functions
- Type-safe with TypeScript

## 🤝 Contributing

This is a student organization project. To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is built for the Kenyan Student Association at the University of Minnesota.

## 🔗 Links

- **Live Site**: [Vercel Deployment](https://vercel.com/officialfoodbridgeinfo-gmailcoms-projects/v0-chelsea-fc-website-clone)
- **Organization**: Kenyan Student Association - University of Minnesota

## 📧 Contact

For questions or support, use the contact form on the website or reach out to the KSA leadership team.

---

Built with ❤️ by the Kenyan Student Association community
