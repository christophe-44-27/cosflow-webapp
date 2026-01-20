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
    confirmPassword: 'Confirm password',
    forgotPassword: 'Forgot password?',
    loginButton: 'Sign in',
    signupButton: 'Sign up',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    orContinueWith: 'Or continue with',
    google: 'Google',
    github: 'GitHub',
    loggingIn: 'Signing in...',
    signingUp: 'Signing up...',
    validation: {
      emailRequired: 'Email is required',
      emailInvalid: 'Email is invalid',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 8 characters',
      nameRequired: 'Name is required',
      nameMinLength: 'Name must be at least 2 characters',
      passwordsMatch: 'Passwords do not match',
    },
    errors: {
      invalidCredentials: 'Invalid email or password',
      serverError: 'An error occurred. Please try again.',
      emailExists: 'This email is already in use',
    },
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
      comingSoon: 'Coming Soon',
      projectManagement: {
        title: 'Project Management',
        description: 'Organize your photoshoots and track the progress of your cosplay projects in real-time.',
      },
      publicOrPrivate: {
        title: 'Public or Private?',
        description: 'Control access to your cosplay projects by showing publicly only what you want.',
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
        'Public and private projects',
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
      appStoreDesc: 'iOS app for iPhone and iPad (Beta)',
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
    featuredCreators: 'Cosflow Creators',
    publicProjects: 'Projects',
    followers: 'Followers',
    projects: 'Projects',
    viewProfile: 'View profile',
    viewAll: 'View all',
    photos: 'photos',
    loadingCreators: 'Loading creators...',
    loadingProjects: 'Loading projects...',
    errorLoadingCreators: 'Error loading creators',
    errorLoadingProjects: 'Error loading projects',
    projectsTotal: 'projects total',
  },

  // Creators View
  creators: {
    title: 'Cosflow Creators',
    searchPlaceholder: 'Search for a creator...',
    filters: {
      all: 'All',
      photographers: 'Photographers',
      cosplayers: 'Cosplayers',
      creators: 'Creators',
    },
    stats: {
      totalCreators: 'Total Creators',
      pages: 'Pages',
      currentPage: 'Current Page',
      creatorsPerPage: 'Creators/Page',
    },
    followers: 'Followers',
    projects: 'Projects',
    viewProfile: 'View profile',
    noCreators: 'No creators found',
    noCreatorsDesc: 'No creators match your search.',
    errorLoading: 'Error loading creators',
    pagination: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      creatorsTotal: 'creators total',
    },
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
    title: 'Projects',
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
      name: 'Pseudonym',
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

  // Project Detail
  projectDetail: {
    loading: 'Loading...',
    error: 'Error',
    projectNotFound: 'Project not found',
    errorLoadingProject: 'Error loading project',
    creator: 'Creator',
    follow: 'Follow',
    share: 'Share',
    copied: 'Copied!',
    stats: {
      photos: 'Photos',
      references: 'References',
      likes: 'Likes',
      progression: 'Progress',
      time: 'Time',
      budget: 'Budget',
      created: 'Created',
      updated: 'Updated',
    },
    gallery: {
      title: 'Gallery',
      photos: 'Photos',
      references: 'References',
      photoshoots: 'Photoshoots',
      noPhotos: 'No photos',
      noReferences: 'No references',
      noPhotoshoots: 'No photoshoots',
      photosCount: 'photos',
    },
    status: {
      completed: 'completed',
      inProgress: 'in_progress',
    },
    elements: {
      title: 'Project Elements',
      task: 'Task',
      buy: 'Purchase',
      make: 'Make',
      noElements: 'No elements',
    },
  },

  // Project Edit
  projectEdit: {
    title: 'Edit Project',
    editButton: 'Edit',
    coverImage: 'Cover Image',
    uploadImage: 'Change image',
    imageHint: 'JPG, PNG or GIF. Max 5MB.',
    titleLabel: 'Title',
    descriptionLabel: 'Description',
    statusLabel: 'Status',
    priorityLabel: 'Priority',
    progressionLabel: 'Progress',
    budgetLabel: 'Estimated budget',
    estimatedEndDateLabel: 'Estimated end date',
    visibilityLabel: 'Visibility',
    privateDesc: 'Only you can see this project',
    publicDesc: 'Everyone can see this project',
    deleteProject: 'Delete project',
    deleteConfirmTitle: 'Delete this project?',
    deleteConfirmDesc: 'This action is irreversible. All project data will be deleted.',
    confirmDelete: 'Yes, delete',
    cancelDelete: 'Cancel',
    status: {
      draft: 'Draft',
      inProgress: 'In Progress',
      completed: 'Completed',
      onHold: 'On Hold',
    },
    priority: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    },
  },

  // Time Management
  timeManagement: {
    title: "Time Management",
    add_action: "Add time",
    label_hours: "Hours",
    label_minutes: "Minutes",
    label_project_elements: "Project Elements",
    label_global_time_project: "Overall project time",
    no_entries: "No time entries",
  },

  // Project Elements
  projectElements: {
    title: "Project Elements",
    add_element: "Add element",
    add_sub_element: "Add sub-element",
    reset: "Reset",
    no_elements: "No elements",
    element_title_placeholder: "Element title...",
    label_price: "Price (optional)",
    label_category: "Category (optional)",
    label_parent_element: "Parent element (optional)",
    no_category: "None",
    no_parent: "None (root element)",
    delete_element: "Delete element",
  },

  // Project Info
  projectInfo: {
    title: "Project Information",
    placeholder_title: "Title",
    placeholder_description: "Description",
    no_description: "No description",
    progression: "Progress",
    total_time: "Total time",
    actual_budget: "Actual budget",
    estimated_budget: "Estimated budget",
    estimated_end_date: "Estimated end date",
    no_end_date: "Not set",
    visibility_private: "Private",
    visibility_public: "Public",
  },

  // Metadata
  metadata: {
    title: 'Cosflow - Cosplay Project Management Platform',
    description: 'The all-in-one platform to manage your cosplay projects, collaborate with photographers and share your passion.',
    homeLong: 'The all-in-one platform to manage your cosplay projects, collaborate with photographers and share your passion. Organize your photoshoots, store your photos and plan your events.',
    projectsTitle: 'Cosplay Projects',
    projectsDescription: 'Discover cosplay projects from the Cosflow community. Explore creations from cosplayers and photographers worldwide.',
    projectDetailDescription: 'Discover this cosplay project on Cosflow',
  },

  // Profile View
  profile: {
    loading: 'Loading...',
    error: 'Error',
    profileNotFound: 'Profile not found',
    profileLoadError: 'Error loading profile',
    follow: 'Follow',
    following: 'Following',
    projects: 'Projects',
    photoshoots: 'Photoshoots',
    events: 'Events',
    followers: 'Followers',
    noDescription: 'No description',
    website: 'Website',
    instagram: 'Instagram',
    twitter: 'X (Twitter)',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    twitch: 'Twitch',
    memberSince: 'Member since',
    completed: 'Completed',
    inProgress: 'In progress',
    noPublicProjects: 'No public projects',
    noProjectsMessage: 'This cosplayer hasn\'t shared any projects yet',
    noPhotoshoots: 'No photoshoots',
    noPhotoshootsMessage: 'This cosplayer hasn\'t shared any photoshoots yet',
    noEvents: 'No events',
    noEventsMessage: 'This cosplayer hasn\'t attended any events yet',
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    past: 'Past',
  },

  // Subscription
  subscription: {
    title: 'Subscription',
    status: {
      free: 'Free',
      premium: 'Elite creator',
      active: 'Elite creator active',
      trial: 'Trial',
      pastDue: 'Past due',
      canceled: 'Canceled',
    },
    premiumActive: 'Your Elite Creator subscription is active. Enjoy all exclusive features.',
    successMessage: 'Welcome to Elite Creator! Your subscription is now active.',
    upgrade: {
      title: 'Upgrade to Elite Creator',
      description: 'Unlock all features and enjoy an unlimited experience.',
      button: 'Upgrade to Elite Creator',
    },
    manageBilling: {
      title: 'Manage billing',
      description: 'Update your subscription, payment information or download invoices.',
    },
    features: {
      unlimitedProjects: 'Unlimited projects',
      prioritySupport: 'Priority support',
      advancedAnalytics: 'Advanced analytics',
      customBranding: 'Profile customization',
    },
    pricing: {
      title: 'Choose your plan',
      subtitle: 'Select the plan that fits your needs',
      monthly: {
        title: 'Monthly',
        price: '$1.49',
        period: 'month',
      },
      yearly: {
        title: 'Yearly',
        price: '$14.99',
        period: 'year',
        savings: 'Save 16%',
      },
      selectPlan: 'Select this plan',
      footer: 'Secure payment via Stripe. Cancel anytime.',
    },
  },
} as const;
