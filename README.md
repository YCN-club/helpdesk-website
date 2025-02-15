# ycn.club helpdesk (website)

![Release Badge](https://img.shields.io/github/v/release/YCN-club/helpdesk-website)
![Forks Badge](https://img.shields.io/github/forks/YCN-club/helpdesk-website?style=flat)

![Cover Image](/meta/cover-image.png)

A complete end-to-end HelpDesk system for institutes; allowing both students and faculty to act as users while utilizing dynamic categories/subcategories, SLAs, assignees, etc. Build with [Next.JS](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com) for the frontend.

> ⚠️ **Note:** This repository has been archived and will no longer receive updates. For further information on the project's status and brand identity, please refer to the [organization's README](https://github.com/orgs/YCN-club).

## History

This project started off as a complete HelpDesk system specifically for the T.A. Pai Institute of Management, Bengaluru. Unfortunately, due to resource constraints and policy conflicts from the Manipal Academy of Higher Education, the student project was archived with the hard work of the team members left undeployed. Hence, the login screen saved as a part of the archived project:

![Login Image](/meta/history-image.png)

While we work towards more generic solutions that can be adopted by other communities, this repository has been transferred to YCN (our _other_ project) and archived for documentation purposes. For more information on the state of the project, please refer to the [organization's README](https://github.com/orgs/YCN-club).

## Product Demo

### General User Experience

The system utilizes [shadcn/ui](https://ui.shadcn.com) for all its UI components. This results in a cohesive environment with subtle animations and functionality as a priority. Dark mode is, of course, supported as well.

![General User Experience Video](/meta/general-ux-video.mp4)

### User View

Users are only allowed to create and view their own tickets, including the selection of the category under which the ticket is created.

![User View Video](/meta/user-view-video.mp4)

### Ticket Resolver View

Resolvers can see a separate dashboard which lists out all the tickets assigned to them. They can only access these tickets specifically and take action in order to resolve the users' issues.

![Ticket Resolver View Video](/meta/resolver-view-video.mp4)

### Administrative View

Administrators have access to everything that the other roles have, along with a new **Admin Settings** page. This allows system administrators to create, edit and delete any of the categories/subcategories, severities, or SLAs in the system. They can also add/edit members of the resolving team.

**Note:** Some parts of this view are still unfinished, such as the implementation of deletion of items and compatibility with the latest changes in the Admin Settings API. As the project is archived, please consider the above before creating a copy.

![Administrative View Video](/meta/administrative-view-video.mp4)

## Configuration

1. All core config. values of the HelpDesk system exist at [`config/site.ts`](/config/site.ts).

   ```ts
   export const siteConfig = {
     name: '...',
     description: 'A helpdesk for students.',
     institute: '...',
   };
   ```

2. [`config/env.ts`](/config/env.ts) exists for the purpose of importing any environment variables required during deployment. If any of the pre-defined environment variables are unavailable, the deployment will fail automatically.

   ```ts
   interface RuntimeEnv {
     BACKEND_URL: string;
   }

   function createEnv(): RuntimeEnv {
     const config: Partial<RuntimeEnv> = {
       BACKEND_URL: 'https://helpdesk-staging.alphaspiderman.dev/api',
     };

     for (const [key, value] of Object.entries(config)) {
       if (value === undefined) {
         throw new Error(`Environment variable ${key} is not defined.`);
       }
     }

     return config as RuntimeEnv;
   }

   export const runtimeEnv = createEnv();
   ```

## Development

1. To install packages, run:

   ```bash
   npm install
   ```

   This fill **force-install** the dependencies, due to compatibility issues with React 19 at the time of development of this project. You can then make changes as necessary in order to be committed.

2. Run the development server:

   ```bash
   npm run dev
   ```

The project is now ready for development!
