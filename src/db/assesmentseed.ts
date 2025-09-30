import { assessmentsDb } from './assessmentsDb';
import { db } from './talenshowDb';
import type { Assessment } from './assessmentsDb';
import { v4 as uuidv4 } from 'uuid';

// Assessment templates for each job type
const ASSESSMENT_TEMPLATES: Record<string, { title: string; description: string; sections: any[] }[]> = {
  'Frontend Engineer': [
    {
      title: 'React & JavaScript Fundamentals',
      description: 'Test your knowledge of React, JavaScript ES6+, and frontend best practices',
      sections: [
        {
          title: 'JavaScript Core Concepts',
          questions: [
            {
              id: uuidv4(),
              text: 'What is the difference between let, const, and var in JavaScript?',
              type: 'long-text',
              required: true,
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Which of the following are valid ways to create a component in React?',
              type: 'multi-choice',
              required: true,
              options: ['Function component', 'Class component', 'Arrow function component', 'Object component', 'HOC component'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain the concept of closures in JavaScript with an example.',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your preferred JavaScript framework?',
              type: 'single-choice',
              required: true,
              options: ['React', 'Vue', 'Angular', 'Svelte', 'Solid'],
              points: 5
            },
            {
              id: 'react-exp-conditional',
              text: 'How many years of React experience do you have?',
              type: 'numeric',
              required: true,
              range: { min: 0, max: 20 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe a complex React application you built (conditional - shown if React experience > 2 years)',
              type: 'long-text',
              required: false,
              conditional: { questionId: 'react-exp-conditional', value: '2' },
              points: 15
            }
          ]
        },
        {
          title: 'React Hooks & State Management',
          questions: [
            {
              id: uuidv4(),
              text: 'What is the purpose of useEffect hook?',
              type: 'single-choice',
              required: true,
              options: ['To manage side effects', 'To create state', 'To render components', 'To handle events'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Describe a scenario where you would use useCallback or useMemo.',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Rate your understanding of React Context API (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Provide a brief example of using useState hook',
              type: 'short-text',
              required: true,
              points: 8
            },
            {
              id: uuidv4(),
              text: 'Which state management libraries have you used?',
              type: 'multi-choice',
              required: true,
              options: ['Redux', 'MobX', 'Zustand', 'Recoil', 'Jotai', 'Context API'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Upload your portfolio or GitHub repository',
              type: 'file-upload',
              required: false,
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Have you worked with TypeScript in React projects?',
              type: 'single-choice',
              required: true,
              options: ['Yes, extensively', 'Yes, a little', 'No, but interested', 'No'],
              points: 5
            }
          ]
        }
      ]
    },
    {
      title: 'CSS & Responsive Design',
      description: 'Evaluate your CSS, layout, and responsive design skills',
      sections: [
        {
          title: 'CSS Fundamentals',
          questions: [
            {
              id: uuidv4(),
              text: 'What is the difference between flexbox and CSS grid?',
              type: 'long-text',
              required: true,
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Which CSS units are relative?',
              type: 'multi-choice',
              required: true,
              options: ['em', 'px', 'rem', '%', 'vh', 'vw', 'cm'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'How would you implement a responsive navigation menu?',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your primary CSS methodology?',
              type: 'single-choice',
              required: true,
              options: ['BEM', 'SMACSS', 'OOCSS', 'Atomic CSS', 'CSS-in-JS'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Write a CSS selector for a specific use case',
              type: 'short-text',
              required: true,
              points: 8
            },
            {
              id: 'css-framework-conditional',
              text: 'Do you use CSS frameworks?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Which CSS frameworks do you use? (conditional)',
              type: 'multi-choice',
              required: false,
              conditional: { questionId: 'css-framework-conditional', value: 'Yes' },
              options: ['Tailwind CSS', 'Bootstrap', 'Material-UI', 'Bulma', 'Foundation', 'Chakra UI'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Rate your CSS animation skills (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Explain CSS specificity and how it works',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Have you used CSS preprocessors?',
              type: 'single-choice',
              required: true,
              options: ['SASS/SCSS', 'LESS', 'Stylus', 'PostCSS', 'Never used'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'What CSS features are you most excited about?',
              type: 'multi-choice',
              required: false,
              options: ['Container queries', 'CSS Grid Level 2', ':has() selector', 'CSS Layers', 'Subgrid'],
              points: 8
            },
            {
              id: uuidv4(),
              text: 'Upload a screenshot of your best CSS work',
              type: 'file-upload',
              required: false,
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe your approach to cross-browser compatibility',
              type: 'short-text',
              required: true,
              points: 10
            }
          ]
        }
      ]
    },
    {
      title: 'Performance & Optimization',
      description: 'Test your understanding of frontend performance optimization',
      sections: [
        {
          title: 'Web Performance',
          questions: [
            {
              id: uuidv4(),
              text: 'What techniques can you use to optimize website loading time?',
              type: 'multi-choice',
              required: true,
              options: ['Code splitting', 'Lazy loading', 'Image optimization', 'Caching', 'Minification', 'Tree shaking'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain the concept of Critical Rendering Path.',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Rate your experience with web performance tools (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'What is your preferred performance testing tool?',
              type: 'single-choice',
              required: true,
              options: ['Lighthouse', 'WebPageTest', 'Chrome DevTools', 'GTmetrix', 'Pingdom'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Name three Core Web Vitals metrics',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: 'perf-optimization-conditional',
              text: 'Have you optimized a production application?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe the performance improvements you achieved (conditional)',
              type: 'long-text',
              required: false,
              conditional: { questionId: 'perf-optimization-conditional', value: 'Yes' },
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which bundlers have you worked with?',
              type: 'multi-choice',
              required: true,
              options: ['Webpack', 'Vite', 'Rollup', 'Parcel', 'esbuild', 'Turbopack'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain the difference between SSR and CSR',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your approach to image optimization?',
              type: 'short-text',
              required: true,
              points: 8
            },
            {
              id: uuidv4(),
              text: 'Rate your knowledge of browser caching strategies (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Have you implemented Progressive Web App features?',
              type: 'single-choice',
              required: true,
              options: ['Yes, multiple PWAs', 'Yes, one PWA', 'Partially', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Upload a performance audit report you created',
              type: 'file-upload',
              required: false,
              points: 5
            }
          ]
        }
      ]
    }
  ],

  'Backend Developer': [
    {
      title: 'API Design & RESTful Services',
      description: 'Assess your knowledge of API design, REST principles, and backend architecture',
      sections: [
        {
          title: 'REST API Concepts',
          questions: [
            {
              id: uuidv4(),
              text: 'What are the main HTTP methods and their purposes?',
              type: 'long-text',
              required: true,
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Which status codes indicate client errors?',
              type: 'multi-choice',
              required: true,
              options: ['400', '401', '404', '500', '502', '403', '422'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain the concept of idempotency in REST APIs.',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your preferred API architecture style?',
              type: 'single-choice',
              required: true,
              options: ['REST', 'GraphQL', 'gRPC', 'SOAP', 'WebSockets'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'How many years of backend development experience do you have?',
              type: 'numeric',
              required: true,
              range: { min: 0, max: 30 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe an API endpoint structure for a user management system',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: 'api-versioning-conditional',
              text: 'Do you implement API versioning?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'What versioning strategy do you use? (conditional)',
              type: 'multi-choice',
              required: false,
              conditional: { questionId: 'api-versioning-conditional', value: 'Yes' },
              options: ['URI versioning', 'Header versioning', 'Query parameter', 'Content negotiation'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain rate limiting and why it is important',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which programming languages do you use for backend?',
              type: 'multi-choice',
              required: true,
              options: ['Node.js', 'Python', 'Java', 'Go', 'C#', 'Ruby', 'PHP'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Rate your API documentation skills (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'What tools do you use for API documentation?',
              type: 'single-choice',
              required: true,
              options: ['Swagger/OpenAPI', 'Postman', 'API Blueprint', 'RAML', 'Custom docs'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Upload a sample API documentation you created',
              type: 'file-upload',
              required: false,
              points: 5
            }
          ]
        }
      ]
    },
    {
      title: 'Database Design & SQL',
      description: 'Test your database design and query optimization skills',
      sections: [
        {
          title: 'Database Fundamentals',
          questions: [
            {
              id: uuidv4(),
              text: 'What is database normalization and why is it important?',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which types of database indexes do you know?',
              type: 'multi-choice',
              required: true,
              options: ['B-tree', 'Hash', 'Full-text', 'Spatial', 'Bitmap', 'Composite'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain the difference between SQL and NoSQL databases.',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your primary database system?',
              type: 'single-choice',
              required: true,
              options: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Rate your SQL query optimization skills (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Write a SQL query to find duplicate records',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: 'db-scaling-conditional',
              text: 'Have you worked on database scaling?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe your database scaling approach (conditional)',
              type: 'long-text',
              required: false,
              conditional: { questionId: 'db-scaling-conditional', value: 'Yes' },
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which database replication strategies do you know?',
              type: 'multi-choice',
              required: true,
              options: ['Master-Slave', 'Master-Master', 'Sharding', 'Partitioning', 'Read replicas'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain ACID properties in databases',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What ORM/Query builder do you prefer?',
              type: 'single-choice',
              required: true,
              options: ['Prisma', 'TypeORM', 'Sequelize', 'Knex', 'Raw SQL', 'Mongoose'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Name three database performance monitoring tools',
              type: 'short-text',
              required: true,
              points: 8
            },
            {
              id: uuidv4(),
              text: 'Upload your database schema design',
              type: 'file-upload',
              required: false,
              points: 5
            }
          ]
        }
      ]
    },
    {
      title: 'Security & Authentication',
      description: 'Evaluate your understanding of backend security practices',
      sections: [
        {
          title: 'Security Best Practices',
          questions: [
            {
              id: uuidv4(),
              text: 'What is JWT and how does it work?',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which security measures should be implemented in a REST API?',
              type: 'multi-choice',
              required: true,
              options: ['HTTPS', 'Input validation', 'Rate limiting', 'CORS', 'SQL injection prevention', 'XSS protection'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain OWASP Top 10 vulnerabilities you are familiar with.',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your preferred authentication method?',
              type: 'single-choice',
              required: true,
              options: ['JWT', 'OAuth 2.0', 'Session-based', 'API Keys', 'SAML'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Rate your security implementation experience (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe how you implement password hashing',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: 'security-audit-conditional',
              text: 'Have you conducted security audits?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe a security vulnerability you discovered and fixed (conditional)',
              type: 'long-text',
              required: false,
              conditional: { questionId: 'security-audit-conditional', value: 'Yes' },
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which encryption algorithms do you use?',
              type: 'multi-choice',
              required: true,
              options: ['AES', 'RSA', 'bcrypt', 'SHA-256', 'argon2', 'PBKDF2'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain the difference between authentication and authorization',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What security testing tools do you use?',
              type: 'single-choice',
              required: true,
              options: ['OWASP ZAP', 'Burp Suite', 'Nessus', 'Snyk', 'SonarQube'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'How do you handle sensitive data in logs?',
              type: 'short-text',
              required: true,
              points: 8
            },
            {
              id: uuidv4(),
              text: 'Upload a security checklist you follow',
              type: 'file-upload',
              required: false,
              points: 5
            }
          ]
        }
      ]
    }
  ],

  'Data Scientist': [
    {
      title: 'Statistical Analysis & Probability',
      description: 'Test your knowledge of statistics and probability theory',
      sections: [
        {
          title: 'Statistics Fundamentals',
          questions: [
            {
              id: uuidv4(),
              text: 'Explain the difference between Type I and Type II errors.',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which statistical tests are used for hypothesis testing?',
              type: 'multi-choice',
              required: true,
              options: ['T-test', 'Chi-square test', 'ANOVA', 'Mann-Whitney U', 'Z-test', 'Wilcoxon'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'What is p-value and how do you interpret it?',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your primary statistical tool?',
              type: 'single-choice',
              required: true,
              options: ['Python (scipy/statsmodels)', 'R', 'SPSS', 'SAS', 'Stata'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'How many years of statistical analysis experience do you have?',
              type: 'numeric',
              required: true,
              range: { min: 0, max: 25 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Define confidence interval in simple terms',
              type: 'short-text',
              required: true,
              points: 8
            },
            {
              id: 'advanced-stats-conditional',
              text: 'Have you used advanced statistical methods?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe an advanced statistical analysis you performed (conditional)',
              type: 'long-text',
              required: false,
              conditional: { questionId: 'advanced-stats-conditional', value: 'Yes' },
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which probability distributions are you familiar with?',
              type: 'multi-choice',
              required: true,
              options: ['Normal', 'Binomial', 'Poisson', 'Exponential', 'Uniform', 'Beta'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain the Central Limit Theorem and its importance',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Rate your knowledge of Bayesian statistics (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'What is your approach to handling outliers?',
              type: 'single-choice',
              required: true,
              options: ['Remove them', 'Transform them', 'Keep them', 'Depends on context', 'Use robust methods'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Upload a statistical analysis report you created',
              type: 'file-upload',
              required: false,
              points: 5
            }
          ]
        }
      ]
    },
    {
      title: 'Machine Learning Basics',
      description: 'Assess your understanding of ML algorithms and techniques',
      sections: [
        {
          title: 'ML Algorithms',
          questions: [
            {
              id: uuidv4(),
              text: 'What is the difference between supervised and unsupervised learning?',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which algorithms are used for classification?',
              type: 'multi-choice',
              required: true,
              options: ['Logistic Regression', 'Decision Trees', 'Random Forest', 'K-means', 'SVM', 'Neural Networks'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain overfitting and how to prevent it.',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your preferred ML framework?',
              type: 'single-choice',
              required: true,
              options: ['Scikit-learn', 'TensorFlow', 'PyTorch', 'XGBoost', 'Keras'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Rate your deep learning expertise (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Explain cross-validation in one sentence',
              type: 'short-text',
              required: true,
              points: 8
            },
            {
              id: 'ml-deployment-conditional',
              text: 'Have you deployed ML models to production?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe your ML deployment process (conditional)',
              type: 'long-text',
              required: false,
              conditional: { questionId: 'ml-deployment-conditional', value: 'Yes' },
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which evaluation metrics do you use for classification?',
              type: 'multi-choice',
              required: true,
              options: ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'AUC-ROC', 'Confusion Matrix'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain the bias-variance tradeoff',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What hyperparameter tuning method do you prefer?',
              type: 'single-choice',
              required: true,
              options: ['Grid Search', 'Random Search', 'Bayesian Optimization', 'Optuna', 'Manual tuning'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'How do you handle imbalanced datasets?',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Upload a Jupyter notebook showcasing your ML work',
              type: 'file-upload',
              required: false,
              points: 5
            }
          ]
        }
      ]
    },
    {
      title: 'Data Visualization & Python',
      description: 'Test your data visualization and Python programming skills',
      sections: [
        {
          title: 'Python & Libraries',
          questions: [
            {
              id: uuidv4(),
              text: 'Which Python libraries do you use for data analysis?',
              type: 'multi-choice',
              required: true,
              options: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'TensorFlow', 'Plotly'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'How would you handle missing data in a dataset?',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Describe your experience with data visualization (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'What is your primary data visualization tool?',
              type: 'single-choice',
              required: true,
              options: ['Matplotlib', 'Seaborn', 'Plotly', 'Tableau', 'Power BI', 'D3.js'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Write a Pandas command to group data by column',
              type: 'short-text',
              required: true,
              points: 8
            },
            {
              id: 'big-data-conditional',
              text: 'Do you work with big data tools?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Which big data tools have you used? (conditional)',
              type: 'multi-choice',
              required: false,
              conditional: { questionId: 'big-data-conditional', value: 'Yes' },
              options: ['Spark', 'Hadoop', 'Kafka', 'Dask', 'Ray', 'Flink'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain feature engineering and its importance',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which data preprocessing techniques do you commonly use?',
              type: 'multi-choice',
              required: true,
              options: ['Normalization', 'Standardization', 'Encoding', 'Feature scaling', 'Imputation', 'Outlier removal'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Rate your SQL skills for data analysis (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'What version control system do you use for data science projects?',
              type: 'single-choice',
              required: true,
              options: ['Git', 'DVC', 'MLflow', 'Both Git and DVC', 'None'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe your approach to exploratory data analysis (EDA)',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Upload a data visualization dashboard you created',
              type: 'file-upload',
              required: false,
              points: 5
            }
          ]
        }
      ]
    }
  ],

  'DevOps Engineer': [
    {
      title: 'CI/CD & Automation',
      description: 'Evaluate your CI/CD pipeline and automation expertise',
      sections: [
        {
          title: 'Continuous Integration',
          questions: [
            {
              id: uuidv4(),
              text: 'What is CI/CD and why is it important?',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which CI/CD tools have you worked with?',
              type: 'multi-choice',
              required: true,
              options: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI', 'Travis CI', 'Azure DevOps', 'ArgoCD'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Describe a complex CI/CD pipeline you have implemented.',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your preferred CI/CD platform?',
              type: 'single-choice',
              required: true,
              options: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI', 'Azure DevOps'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'How many years of DevOps experience do you have?',
              type: 'numeric',
              required: true,
              range: { min: 0, max: 20 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Write a simple CI pipeline configuration example',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: 'gitops-conditional',
              text: 'Have you implemented GitOps practices?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe your GitOps workflow (conditional)',
              type: 'long-text',
              required: false,
              conditional: { questionId: 'gitops-conditional', value: 'Yes' },
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which testing types do you automate in pipelines?',
              type: 'multi-choice',
              required: true,
              options: ['Unit tests', 'Integration tests', 'E2E tests', 'Security scans', 'Performance tests', 'Static analysis'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain blue-green deployment strategy',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Rate your infrastructure automation skills (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'What is your deployment frequency target?',
              type: 'single-choice',
              required: true,
              options: ['Multiple times per day', 'Daily', 'Weekly', 'Monthly', 'On-demand'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Upload a CI/CD pipeline diagram you designed',
              type: 'file-upload',
              required: false,
              points: 5
            }
          ]
        }
      ]
    },
    {
      title: 'Containerization & Orchestration',
      description: 'Test your Docker and Kubernetes knowledge',
      sections: [
        {
          title: 'Docker & Kubernetes',
          questions: [
            {
              id: uuidv4(),
              text: 'Explain the difference between Docker containers and virtual machines.',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What are the key components of Kubernetes?',
              type: 'multi-choice',
              required: true,
              options: ['Pods', 'Services', 'Deployments', 'ConfigMaps', 'Ingress', 'Nodes', 'StatefulSets'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'How would you troubleshoot a failing pod in Kubernetes?',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your primary container orchestration platform?',
              type: 'single-choice',
              required: true,
              options: ['Kubernetes', 'Docker Swarm', 'ECS', 'Nomad', 'OpenShift'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Rate your Kubernetes expertise (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Write a basic Dockerfile for a Node.js app',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: 'k8s-production-conditional',
              text: 'Have you managed Kubernetes in production?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe a production Kubernetes issue you resolved (conditional)',
              type: 'long-text',
              required: false,
              conditional: { questionId: 'k8s-production-conditional', value: 'Yes' },
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which Kubernetes monitoring tools do you use?',
              type: 'multi-choice',
              required: true,
              options: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog', 'New Relic', 'Lens'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain Kubernetes networking and service discovery',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your approach to container security?',
              type: 'single-choice',
              required: true,
              options: ['Image scanning', 'Network policies', 'RBAC', 'All of the above', 'Not implemented'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'How do you handle secrets in Kubernetes?',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Upload a Kubernetes manifest file you created',
              type: 'file-upload',
              required: false,
              points: 5
            }
          ]
        }
      ]
    },
    {
      title: 'Infrastructure as Code',
      description: 'Assess your IaC and cloud infrastructure knowledge',
      sections: [
        {
          title: 'IaC Tools',
          questions: [
            {
              id: uuidv4(),
              text: 'What is Infrastructure as Code and its benefits?',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which IaC tools have you used?',
              type: 'multi-choice',
              required: true,
              options: ['Terraform', 'Ansible', 'CloudFormation', 'Pulumi', 'Chef', 'Puppet', 'CDK'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Rate your cloud platform experience (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'What is your primary cloud provider?',
              type: 'single-choice',
              required: true,
              options: ['AWS', 'Azure', 'GCP', 'DigitalOcean', 'Multi-cloud'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Write a simple Terraform resource block',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: 'multi-cloud-conditional',
              text: 'Do you manage multi-cloud infrastructure?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe your multi-cloud strategy (conditional)',
              type: 'long-text',
              required: false,
              conditional: { questionId: 'multi-cloud-conditional', value: 'Yes' },
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which infrastructure monitoring tools do you use?',
              type: 'multi-choice',
              required: true,
              options: ['CloudWatch', 'Azure Monitor', 'Stackdriver', 'Prometheus', 'Datadog', 'New Relic'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain infrastructure drift and how to prevent it',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your disaster recovery strategy?',
              type: 'single-choice',
              required: true,
              options: ['Backup and restore', 'Pilot light', 'Warm standby', 'Multi-site active-active', 'Not implemented'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Rate your experience with serverless technologies (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'How do you manage infrastructure costs?',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Upload an infrastructure diagram you created',
              type: 'file-upload',
              required: false,
              points: 5
            }
          ]
        }
      ]
    }
  ]
};

// Generate a generic assessment template for job titles not in the above list
function generateGenericAssessments(jobTitle: string): { title: string; description: string; sections: any[] }[] {
  return [
    {
      title: `${jobTitle} - Technical Skills Assessment`,
      description: `Evaluate core technical competencies for ${jobTitle} role`,
      sections: [
        {
          title: 'Technical Knowledge',
          questions: [
            {
              id: uuidv4(),
              text: `What are the key responsibilities of a ${jobTitle}?`,
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which tools and technologies are you proficient in?',
              type: 'multi-choice',
              required: true,
              options: ['Web Development', 'MERN', 'ML/AI', 'C++/Java', 'Python', 'DevOps', 'Data Science'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Describe your most challenging project in this field.',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your primary area of expertise?',
              type: 'single-choice',
              required: true,
              options: ['Frontend', 'Backend', 'Full-stack', 'Data', 'Infrastructure'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'How many years of experience do you have in this role?',
              type: 'numeric',
              required: true,
              range: { min: 0, max: 30 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Name your top three technical skills',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: 'certification-conditional',
              text: 'Do you have relevant certifications?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'List your certifications (conditional)',
              type: 'multi-choice',
              required: false,
              conditional: { questionId: 'certification-conditional', value: 'Yes' },
              options: ['AWS Certified', 'Azure Certified', 'Google Cloud Certified', 'Kubernetes CKA', 'Other'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'What development methodologies are you familiar with?',
              type: 'multi-choice',
              required: true,
              options: ['Agile', 'Scrum', 'Kanban', 'Waterfall', 'Lean', 'XP'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain your approach to continuous learning',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Rate your proficiency in this role (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'What is your preferred development environment?',
              type: 'single-choice',
              required: true,
              options: ['VS Code', 'IntelliJ IDEA', 'Vim/Neovim', 'Sublime Text', 'Other'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Upload your resume or portfolio',
              type: 'file-upload',
              required: false,
              points: 5
            }
          ]
        }
      ]
    },
    {
      title: `${jobTitle} - Problem Solving`,
      description: 'Test problem-solving and analytical skills',
      sections: [
        {
          title: 'Analytical Thinking',
          questions: [
            {
              id: uuidv4(),
              text: 'Describe your approach to solving complex technical problems.',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Rate your problem-solving skills (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 10
            },
            {
              id: uuidv4(),
              text: 'What methodologies do you follow?',
              type: 'multi-choice',
              required: false,
              options: ['Agile', 'Scrum', 'Kanban', 'Waterfall', 'Lean', 'DevOps'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'How do you approach debugging?',
              type: 'single-choice',
              required: true,
              options: ['Systematic approach', 'Trial and error', 'Ask for help', 'Google first', 'Check logs'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe a bug you spent the most time fixing',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: 'mentoring-conditional',
              text: 'Have you mentored junior developers?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe your mentoring approach (conditional)',
              type: 'long-text',
              required: false,
              conditional: { questionId: 'mentoring-conditional', value: 'Yes' },
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which problem-solving techniques do you use?',
              type: 'multi-choice',
              required: true,
              options: ['Root cause analysis', 'Five whys', 'Fishbone diagram', 'SWOT analysis', 'Brainstorming', 'Design thinking'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain a time you had to learn a new technology quickly',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Rate your adaptability to new technologies (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'What is your approach to documentation?',
              type: 'single-choice',
              required: true,
              options: ['Document everything', 'Document as needed', 'Self-documenting code', 'Minimal docs', 'Hate documenting'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'How do you prioritize tasks?',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Upload a technical document you wrote',
              type: 'file-upload',
              required: false,
              points: 5
            }
          ]
        }
      ]
    },
    {
      title: `${jobTitle} - Soft Skills & Collaboration`,
      description: 'Assess communication and teamwork abilities',
      sections: [
        {
          title: 'Team Collaboration',
          questions: [
            {
              id: uuidv4(),
              text: 'How do you handle conflicts in a team setting?',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What communication tools do you prefer?',
              type: 'multi-choice',
              required: false,
              options: ['Slack', 'Microsoft Teams', 'Email', 'Jira', 'Confluence', 'Discord'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe a time you mentored or helped a colleague.',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'What is your preferred work environment?',
              type: 'single-choice',
              required: true,
              options: ['Remote', 'Office', 'Hybrid', 'Flexible', 'No preference'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Rate your communication skills (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'How do you give feedback to team members?',
              type: 'short-text',
              required: true,
              points: 10
            },
            {
              id: 'leadership-conditional',
              text: 'Have you led a team or project?',
              type: 'single-choice',
              required: true,
              options: ['Yes', 'No'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Describe your leadership experience (conditional)',
              type: 'long-text',
              required: false,
              conditional: { questionId: 'leadership-conditional', value: 'Yes' },
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Which team collaboration practices do you value?',
              type: 'multi-choice',
              required: true,
              options: ['Code reviews', 'Pair programming', 'Stand-ups', 'Retrospectives', 'Planning meetings', 'Documentation'],
              points: 10
            },
            {
              id: uuidv4(),
              text: 'Explain your approach to giving presentations',
              type: 'long-text',
              required: true,
              points: 15
            },
            {
              id: uuidv4(),
              text: 'Rate your ability to work under pressure (1-10)',
              type: 'numeric',
              required: true,
              range: { min: 1, max: 10 },
              points: 5
            },
            {
              id: uuidv4(),
              text: 'What motivates you the most?',
              type: 'single-choice',
              required: true,
              options: ['Solving problems', 'Learning new things', 'Team success', 'Recognition', 'Impact'],
              points: 5
            },
            {
              id: uuidv4(),
              text: 'Upload a presentation or case study you created',
              type: 'file-upload',
              required: false,
              points: 5
            }
          ]
        }
      ]
    }
  ];
}

export async function seedAssessments() {
  // Check if assessments already exist
  const count = await assessmentsDb.assessments.count();
  if (count > 0) {
    console.log('Assessments already seeded. Skipping...');
    return;
  }

  // Get all jobs from the database
  const jobs = await db.jobs.toArray();
  if (jobs.length === 0) {
    console.log('No jobs found. Please seed jobs first.');
    return;
  }

  const assessmentsToCreate: Assessment[] = [];
  const now = new Date().toISOString();

  for (const job of jobs) {
    // Get templates for this job title or use generic ones
    const templates = ASSESSMENT_TEMPLATES[job.title] || generateGenericAssessments(job.title);

    // Create 3 assessments for each job
    templates.forEach((template, index) => {
      assessmentsToCreate.push({
        jobId: job.id!,
        title: template.title,
        description: template.description,
        sections: template.sections,
        timeLimit: 45 + (index * 15), // 45, 60, 75 minutes
        passingScore: 60 + (index * 5), // 60%, 65%, 70%
        isActive: true,
        createdAt: now,
        updatedAt: now
      });
    });
  }

  // Bulk insert all assessments
  await assessmentsDb.assessments.bulkAdd(assessmentsToCreate);
  console.log(`Seeded ${assessmentsToCreate.length} assessments for ${jobs.length} jobs`);
}
export async function clearAssessmentsDB() {
  await Promise.all([
    assessmentsDb.assessments.clear(),
    assessmentsDb.responses.clear(),
    assessmentsDb.assignments.clear()
  ]);
}

// Initialize assessments on app load
export async function initializeAssessments() {
  try {
 
    await seedAssessments();
  } catch (error) {
    console.error('Error seeding assessments:', error);
  }
}