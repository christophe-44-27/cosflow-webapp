import { Translations } from './fr';

export const en: Translations = {
  // Common
  common: {
    search: 'Search...',
    new: 'New',
    filters: 'Filters',
    all: 'All',
    viewAll: 'View all',
    loading: 'Loading...',
    error: 'Error',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    next: 'Next',
    previous: 'Previous',
    page: 'Page',
    of: 'of',
    total: 'total',
  },

  // Sidebar
  sidebar: {
    appName: 'Cosflow',
    home: 'Home',
    discovery: 'Discovery',
    myGallery: 'My Gallery',
    myProjects: 'My Projects',
    events: 'Events',
    forge: 'Forge',
    myAccount: 'My Account',
    login: 'Sign in',
    logout: 'Logout',
  },

  // Header
  header: {
    welcome: 'Welcome',
    publicGallery: 'Public Gallery',
    publicProjects: 'Public Projects',
    myAccount: 'My Account',
    discovery: 'Discovery',
  },

  // Auth Modal
  auth: {
    login: 'Sign in',
    signup: 'Sign up',
    loginSubtitle: 'Sign in to access your projects',
    signupSubtitle: 'Create an account to get started',
    fullName: 'Full name',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    loginButton: 'Sign in',
    signupButton: 'Sign up',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    orContinueWith: 'Or continue with',
    google: 'Google',
    github: 'GitHub',
  },

  // Landing View
  landing: {
    welcome: 'Welcome',
    whatIs: 'What is',
    hero: {
      subtitle: 'The all-in-one platform to manage your cosplay projects, collaborate with photographers and share your passion',
      cta: 'Get started for free',
    },
    features: {
      title: 'Everything you need',
      projectManagement: {
        title: 'Project Management',
        description: 'Organize your photoshoots and track the progress of your cosplay projects in real-time.',
      },
      privateGalleries: {
        title: 'Private Galleries',
        description: 'Store and share your photos in secure galleries with access control.',
      },
      events: {
        title: 'Events',
        description: 'Plan and manage your attendance at conventions and cosplay events.',
      },
      collaboration: {
        title: 'Collaboration',
        description: 'Work as a team with photographers, cosplayers and content creators.',
      },
    },
    howItWorks: {
      title: 'How does it work?',
      subtitle: 'Simple, fast and efficient',
      step1: {
        title: 'Create your account',
        description: 'Sign up for free and set up your profile in minutes',
      },
      step2: {
        title: 'Organize your projects',
        description: 'Create projects, plan your shoots and invite your collaborators',
      },
      step3: {
        title: 'Share your creations',
        description: 'Publish your photos and share them with your community',
      },
    },
    benefits: {
      title: 'Why choose Cosflow?',
      subtitle: 'We designed Cosflow specifically for the needs of cosplayers and photographers. A complete solution that understands your workflow.',
      list: [
        'Intuitive and modern interface',
        'Secure photo storage',
        'Real-time collaboration',
        'Project progress tracking',
        'Public and private galleries',
        'Notifications and reminders',
      ],
      ultraFast: {
        title: 'Ultra fast',
        description: 'Optimized performance for a smooth experience',
      },
      secure: {
        title: '100% secure',
        description: 'Your data is protected with the best standards',
      },
      community: {
        title: 'Active community',
        description: 'Join thousands of passionate creators',
      },
      free: {
        title: 'Free',
        description: 'Get started with no commitment, all features included',
      },
    },
    cta: {
      title: 'Ready to get started?',
      subtitle: 'Join Cosflow today and turn your passion into organized projects',
      button: 'Create my free account',
      footer: 'No credit card required • Setup in 2 minutes',
    },
    mobile: {
      title: 'Download the mobile app',
      subtitle: 'Enjoy Cosflow everywhere with our mobile apps',
      appStore: 'App Store',
      appStoreDesc: 'iOS app for iPhone and iPad',
      googlePlay: 'Google Play',
      googlePlayDesc: 'Android app available now',
      discord: 'Discord',
      discordDesc: 'Join our active community',
      comingSoon: 'Coming soon',
      download: 'Download',
      join: 'Join',
      autoSync: {
        title: 'Automatic synchronization',
        description: 'Your data is synchronized in real-time between web and mobile app',
      },
      communitySupport: {
        title: 'Community support',
        description: 'An active and responsive community to help you and share your experiences',
      },
    },
  },

  // Discovery View
  discovery: {
    title: 'Discovery',
    featuredCreators: 'Cosflow creators',
    publicProjects: 'Public projects',
    followers: 'Followers',
    projects: 'Projects',
    viewProfile: 'View profile',
    photos: 'photos',
    loadingCreators: 'Loading creators...',
    loadingProjects: 'Loading projects...',
    errorLoadingCreators: 'Error loading creators',
    errorLoadingProjects: 'Error loading projects',
  },

  // Gallery View
  gallery: {
    title: 'Public Gallery',
    filters: {
      all: 'All',
      animeManga: 'Anime/Manga',
      gaming: 'Gaming',
      comics: 'Comics',
      original: 'Original',
    },
    photos: 'photos',
    views: 'views',
    likes: 'likes',
  },

  // Projects View
  projects: {
    title: 'Public Projects',
    stats: {
      totalProjects: 'Total Projects',
      pages: 'Pages',
      currentPage: 'Current Page',
      projectsPerPage: 'Projects/Page',
    },
    filters: {
      all: 'All projects',
      animeManga: 'Anime/Manga',
      gaming: 'Gaming',
      original: 'Original',
    },
    photos: 'photos',
    noProjects: 'No projects found',
    noProjectsDesc: 'Public projects will appear here.',
    errorLoading: 'Error loading projects',
    pagination: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      projectsTotal: 'projects total',
    },
  },

  // Account View
  account: {
    title: 'My Account',
    viewPublicProfile: 'View public profile',
    stats: {
      title: 'Statistics',
      projects: 'Projects',
      galleries: 'Galleries',
      followers: 'Followers',
      following: 'Following',
    },
    personalInfo: {
      title: 'Personal information',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      verify: 'Verify',
      bio: 'Bio',
      saveChanges: 'Save changes',
    },
    security: {
      title: 'Security',
      changePassword: {
        title: 'Change password',
        lastModified: 'Last modified 3 months ago',
      },
      twoFactor: {
        title: 'Two-factor authentication',
        status: 'Not enabled',
      },
    },
    privacy: {
      title: 'Privacy',
      publicProfile: {
        title: 'Public profile',
        description: 'Your profile is visible to everyone',
      },
      emailNotifications: {
        title: 'Email notifications',
        description: 'Receive updates by email',
      },
    },
    data: {
      title: 'Data',
      export: {
        title: 'Export my data',
        description: 'Download a copy of your information',
      },
    },
  },

  // Pagination
  pagination: {
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    total: 'total',
  },
} as const;
