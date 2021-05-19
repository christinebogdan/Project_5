# FishEye | Freelancer Sourcing Platform

## Developed Skills

- Manage website events
- Develop a modular app with design patterns
- Write maintainable JavaScript code
- Ensure the accessibility of a website

## Description

FishEye is a website for freelance photographers to show off their best work.

Aim of the project was to create a prototype for the website with a **homepage** and **individual pages for every photographer**. In addition to that, the the site should be **accessible** to visually impaired users and users should be able to **navigate the site using keyboard controls**.A JSON to mimic the data structure on the database, as well as images and logo were provided.

## Objectives

### CONTENT

1. Homepage

   - **Lists all the photographers** with their name, tagline, location, price/hour, tags,
     and a thumbnail image of their choice
   - Clicking on a tag on the **navigation bar filters the list of photographers** to only
     show those that correspond to that tag.
   - **photographer’s thumbnail is clickable**, and redirects user to the photographer's page.

2. Photographer pages (one for each sample photographer, 6 in total) **created dynamically through JSON** data
   - Shows a **gallery** of the photographer’s work
     - Photographers can show both **photos and videos** (media items).
     - In the case of **videos**, show a **thumbnail image** in the gallery.
   - Each media item includes the title, date (as attribute in the markup), price, and the number of likes.
     - **Like icon** is **clickable**, and when user clicks, **increment number of likes**
     - The **total number of likes** should be counted and added to the total on the photographer’s profile.
   - The media items can be **sorted by popularity, date, or title**.
   - When the user clicks on a media item, **show media item in a lightbox**.
     - When showing the lightbox, **implement x (close) button** in the corner to close the
       window.
     - **Show navigation buttons** on the side to switch from media item to
       media item (users can click on these buttons to navigate).
     - The **arrow keys also navigate** between the media items.
   - Show a **contact button** on photographer page
     - The contact form is a **modal containing a form** that is shown on top of the rest.
     - It includes fields for the **name, email, and message**.
     - **Print** content of the input fields **to the console log**.

### ACCESSIBILITY

- Use of “semantic” HTML elements
- Added ARIA attributes to all custom elements
- Code must pass the AChecker tests with no known problems (and be
  compliant with WCAG).
- All event handling (e.g., clicks and keyboard presses) should be set up
- Test with screen reader
- Adding a JSON field for the alt description for each image

## Requirements

- must pass W3C validation for HTML and CSS without errors
- must be responsive for mobile and desktop, no tablet design needed
- use ESLint
- apply **object-oriented programming**
- use **factory method pattern**

## Challenges & Achievements

- bild custom drop down menu and apply ARIA attributes
- implement factory method pattern
- use Babel and set up webpack
- use of asynchronous programming to mimick server request

## Demo

[Link to website](https://christinebogdan.github.io/p4_FreelancerSourcingPlatform/)

# <img src="./Screenshots/desktop_1.png">
