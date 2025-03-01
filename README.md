# notebook-client

# Frontend Project - Notes Application

This project is the frontend part of an application developed for the *Information Systems Architecture* course in the Computer Engineering program. The backend has been provided by the professor, and the task was to implement a frontend that supports a series of user stories described below.

## Technologies Used

- **Vue.js**: JavaScript framework for building reactive user interfaces.
- **Vue Router**: For managing routes and navigation between different views of the application.
- **Vuex**: For managing the global state of the application (if necessary).
- **CSS/SASS**: For styling the views.

## User Stories Implemented

1. **User Registration**: As an anonymous user, the user can register in the application with a username and password. After registration, the user is automatically authenticated.
2. **User Authentication**: As an anonymous user, the user can log in by entering their username and password.
3. **Log Out**: As an authenticated user, the user can log out from the application via a link in the menu.
4. **Create Note**: As an authenticated user, the user can create notes with a title, content, and one or more associated categories.
5. **Note List**: As an authenticated user, the user sees a list of their notes, ordered chronologically.
6. **Individual Note View**: As an authenticated user, the user can view the details of a specific note.
7. **Category-Based List**: As an authenticated user, the user can filter notes by categories.
8. **Archive Note**: As an authenticated user, the user can archive or unarchive notes.
9. **Show Archived Notes**: As an authenticated user, the user can hide or show archived notes in the list view.
10. **Edit Note**: As an authenticated user, the user can edit the content and/or title of a note.
11. **Delete Note**: As an authenticated user, the user can delete notes with a confirmation prompt.
12. **User List (Admin)**: As an admin user, the user can view the list of registered users.
13. **Delete User (Admin)**: As an admin user, the user can delete a user and all their notes.
14. **Deactivate User (Admin)**: As an admin user, the user can deactivate a user and hide their notes.
15. **Activate User (Admin)**: As an admin user, the user can activate a deactivated user and show their notes again.
16. **Admin Note List**: As an admin user, the user can view all notes, including the username of the creator and their archived status.
17. **Admin Notes by User**: As an admin user, the user can view the notes of any user.
18. **Category List (Admin)**: As an admin user, the user can view the list of categories in the application.
19. **Admin Notes by Category**: As an admin user, the user can view all notes by category across all users.
20. **Create Category (Admin)**: As an admin user, the user can create a new category.
21. **Edit Category (Admin)**: As an admin user, the user can edit an existing category.
22. **Delete Category (Admin)**: As an admin user, the user can delete a category. All notes associated with it will simply lose the association.


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Format with [Prettier](https://prettier.io)

```sh
npm run format
```
