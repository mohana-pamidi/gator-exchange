<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- [![Stargazers][stars-shield]][stars-url] -->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img width="318" height="75" alt="image" src="https://github.com/user-attachments/assets/e9d5b77b-f5b3-48c1-823d-d53aa8d23bbd" />
  </a>
  
<h3 align="center">Gator Exchange</h3>

  <p align="center">
    Gator Exchange is a website that allows students to rent equipment for short periods of time from other students on campus.
    <br />
    <!-- <a href="https://github.com/github_username/repo_name">View Demo</a> need to add working demo link-->
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Technology Stack</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

<!-- Here's a blank template to get started. To avoid retyping too much info, do a search and replace with your text editor for the following: `github_username`, `repo_name`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description`, `project_license` -->

Gator Exchange is a MERN stack web application that enables university students to rent and lend equipment to one another for short periods of time, promoting affordability, sustainability, and community on campus. The platform includes features such as searchable and filterable listings, direct messaging, user profiles, and ratings and reviews. This project was designed as a student-focused alternative to expensive rental companies or unreliable informal borrowing. It provides a trusted, verified, and convenient way for students to save money, earn income, and share resources.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Technology Stack

- [![MongoDB][MongoDB]][MongoDB-url]
- [![Express.js][Express.js]][Express-url]
- [![React][React.js]][React-url]
- [![Node.js][Node.js]][Node-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation

#### 1. Repository Setup

Clone the repository:

```sh
git clone https://github.com/mohana-pamidi/gator-exchange.git
```

#### 2. Database Setup

Get a free MongoDB Atlas URI at [https://www.mongodb.com/products/platform/atlas-database](https://www.mongodb.com/products/platform/atlas-database)

#### 3. Email Configuration

1. Go to your Google Account Security Settings at [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable 2-Step Verification (if it's not already enabled)
3. Search for "App passwords", create a new one named "Gator Exchange", and copy the 16-character code

#### 4. Server Configuration

1. Inside `gator-exchange-server`, create a file named `config.env`
2. Add your MongoDB database connection string:
   ```
   ATLAS_URI=your_mongodb_uri
   ```
3. Add your email address and 16-character app password:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
   Note: This is not your regular email password, but the 16-character app password created in step 3.

4. Add the application URLs:
   ```
   BASE_URL=http://localhost:3001
   FRONTEND_URL=http://localhost:5173
   ```

#### 5. Install Dependencies

Install the NPM packages in both the client and server:

```sh
cd gator-exchange-client
npm install

cd ../gator-exchange-server
npm install
```

#### 6. Start the Application

Start the server:

```sh
cd gator-exchange-server
node index.js
```

Start the client (open a new terminal window):

```sh
cd gator-exchange-client
npm run dev
```

#### 7. Access the Application

Navigate to the frontend URL in your browser: [http://localhost:5173](http://localhost:5173)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/mohana-pamidi/gator-exchange/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=mohana-pamidi/gator-exchange" alt="contrib.rocks image" />
</a>

<!-- CONTACT -->

## Contact
<h3>Aanya Bhandari</h3>

[![LinkedIn][linkedin-shield]](https://www.linkedin.com/in/aanya-bhandari-ny/)

<h3>Kayla Chen</h3>

[![LinkedIn][linkedin-shield]](https://www.linkedin.com/in/kaylachenn/)

<h3>Avigail Laing</h3>

[![LinkedIn][linkedin-shield]](https://www.linkedin.com/in/avigail-laing/)

<h3>Mohana Pamidimukkala</h3>

[![LinkedIn][linkedin-shield]](https://www.linkedin.com/in/mohana-pamidi/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- This README was adapted from a template provided by [Best-README-Template](https://github.com/othneildrew/Best-README-Template).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/mohana-pamidi/gator-exchange.svg?style=for-the-badge
[contributors-url]: https://github.com/mohana-pamidi/gator-exchange/graphs/contributors
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555

<!-- [stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers -->

[issues-shield]: https://img.shields.io/github/issues/mohana-pamidi/gator-exchange.svg?style=for-the-badge
[issues-url]: https://github.com/mohana-pamidi/gator-exchange/issues
[product-screenshot]: images/screenshot.png

<!-- Shields.io badges. You can a comprehensive list with many more badges at: https://github.com/inttter/md-badges -->

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[MongoDB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
