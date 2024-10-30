<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

<h1>Fashion Recommender App</h1>

<p>This project is a React Native fashion application designed to help users upload outfit images, organize wardrobe pieces, and receive personalized outfit recommendations. The app combines image detection, data storage, and machine learning to create a unique user experience.</p>

<h2>Table of Contents</h2>
<ol>
    <li><a href="#features">Features</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li><a href="#setup">Setup</a></li>
    <li><a href="#architecture">Architecture</a></li>
    <li><a href="#image-processing">Image Processing</a></li>
    <li><a href="#data-storage">Data Storage</a></li>
    <li><a href="#background-removal">Background Removal</a></li>
    <li><a href="#outfit-recommendations-api">Outfit Recommendations</a></li>
    <li><a href="#profile-navigation">Profile Navigation</a></li>
    <li><a href="#future-development">Future Development</a></li>
    <li><a href="#license">License</a></li>
</ol>

<h2 id="features">Features</h2>
<ul>
    <li><strong>Outfit Detection:</strong> Users upload an image of their outfit, and the app automatically detects, categorizes, and tags individual clothing items through image processing and deep scraping. The primary objective is to extract rich JSON data with detailed product information for everyday clothing items. Tagging leverages OpenAI-based processing and scraping to assign attributes such as color, material, and brand, which are stored in a comprehensive metadata structure.</li>
    <li><strong>Background Removal:</strong> To enhance item presentation, especially in the Closet view, product images retrieved from Google are processed to remove backgrounds, isolating the items for a cleaner look.</li>
    <li><strong>Wardrobe and Closet Organization:</strong> Users can store and organize wardrobe items, creating a virtual closet. The Closet page allows users to experiment with outfit combinations, using saved and liked items to curate looks from existing wardrobe pieces or items saved to their wish list.</li>
    <li><strong>Nested Navigation and Social Features:</strong> With nested navigation, users can explore other profiles, view outfits, upload their looks, and engage with community content. The Profile page catalogs outfits, individual items, liked outfits, and liked items, offering a detailed view of each user’s style.</li>
    <li><strong>Outfit Recommendation Engine:</strong> Powered by a custom-built recommendation API, the app suggests outfit combinations based on learned compatibility scores between items. This API, which uses a Siamese neural network for compatibility learning, makes recommendations by comparing items’ deep-tag attributes and user preferences. (The API has its own documentation repository for setup and usage, detailed below.)</li>
</ul>

<h2 id="outfit-recommendation-api">Outfit Recommendation API</h2>
<p>The Outfit Recommendation API provides the intelligence behind the personalized outfit suggestions. It is a machine learning-powered service that analyzes item compatibility and user preferences to deliver tailored outfit recommendations. Below is an overview of its structure and key components:</p>
<h3>Key Features</h3>
<ul>
    <li><strong>Data Preprocessing:</strong> Loads and processes JSON and CSV data, encoding categorical attributes for compatibility learning.</li>
    <li><strong>Siamese Neural Network:</strong> Uses a neural network architecture to assess compatibility between items based on user interactions.</li>
    <li><strong>API Service:</strong> A Flask API allows external access to the recommendation engine, providing outfit suggestions based on user input.</li>
</ul>

<h3>API Usage</h3>
<p>To retrieve outfit recommendations, users submit item identifiers, and the API returns items with high compatibility scores based on trained embeddings and similarity analysis.</p>

<h4>Example Request</h4>
<pre><code>
curl -X POST -H "Content-Type: application/json" -d '{"user_id": "u1", "item_ids": ["i1", "i2"]}' http://localhost:5000/recommend
</code></pre>

<p>For full setup and usage instructions, please refer to the separate <code>README.md</code> in the recommendation API repository.</p>

<h2 id="tech-stack">Tech Stack</h2>
<ul>
    <li><strong>Frontend:</strong> React Native (Expo)</li>
    <li><strong>Backend:</strong> Supabase (Database and Authentication), Node.js</li>
    <li><strong>APIs:</strong> Cloudinary, Lykdat, Serpapi (Google Lens)</li>
    <li><strong>Machine Learning:</strong> Custom-trained compatibility recommendation engine using TensorFlow or similar frameworks.</li>
</ul>

<h2 id="setup">Setup</h2>
<h3>Prerequisites</h3>
<ul>
    <li><strong>Node.js</strong> and <strong>npm</strong> installed.</li>
    <li><strong>Expo CLI</strong> for running React Native.</li>
    <li>Accounts on <strong>Cloudinary</strong>, <strong>Lykdat</strong>, <strong>Serpapi</strong>, and <strong>Supabase</strong> with relevant API keys.</li>
</ul>

<h3>Installation</h3>
<ol>
    <li><strong>Clone the Repository:</strong>
    <pre><code>git clone &lt;repo-url&gt;
cd &lt;repo-directory&gt;</code></pre></li>
    <li><strong>Install Dependencies:</strong>
    <pre><code>npm install</code></pre></li>
    <li><strong>Set up Environment Variables:</strong>
        <p>Create a <code>.env</code> file in the root directory.</p>
        <p>Add your API keys for Cloudinary, Lykdat, Serpapi, and Supabase:</p>
        <pre><code>CLOUDINARY_API_KEY=&lt;your-cloudinary-api-key&gt;
LYKDAT_API_KEY=&lt;your-lykdat-api-key&gt;
SERPAPI_API_KEY=&lt;your-serpapi-api-key&gt;
SUPABASE_URL=&lt;your-supabase-url&gt;
SUPABASE_API_KEY=&lt;your-supabase-api-key&gt;</code></pre>
    </li>
    <li><strong>Start the Expo App:</strong>
    <pre><code>expo start</code></pre></li>
</ol>

<h2 id="architecture">Architecture</h2>

<h3>Frontend</h3>
<ul>
    <li><strong>React Native with Expo:</strong> The frontend UI is built using React Native, leveraging Expo for easy deployment and testing.</li>
    <li><strong>Profile Navigation and Routing:</strong> Uses React Navigation to handle user profiles, allowing users to view and interact with other profiles.</li>
    <li><strong>Image Processing Interface:</strong> Provides an intuitive way for users to upload, view, and manage their outfit images.</li>
</ul>

<h3>Backend</h3>
<ul>
    <li><strong>Supabase:</strong> A PostgreSQL database handles user authentication and stores wardrobe data, including tags and metadata for each clothing item.</li>
    <li><strong>Cloudinary for Media Storage:</strong> All uploaded images are stored in Cloudinary, optimizing image delivery and allowing easy retrieval.</li>
</ul>

<h2 id="image-processing">Image Processing</h2>

<h3>Workflow</h3>
<ol>
    <li><strong>Image Upload:</strong> Users upload an outfit image, which is sent to Cloudinary for initial storage.</li>
    <li><strong>Item Detection:</strong> The image URL is passed to Lykdat’s item detection API, which analyzes the image, identifies individual clothing items, and assigns tags.</li>
    <li><strong>Product Recommendations:</strong> The tags are then used to query Serpapi’s Google Lens API, retrieving links to similar products.</li>
</ol>

<h3>Tags and Metadata</h3>
<p>Each detected item is tagged with attributes such as:</p>
<ul>
    <li><strong>Category:</strong> Type of clothing (e.g., shirt, pants, shoes)</li>
    <li><strong>Brand:</strong> Recognized brand, if detectable</li>
    <li><strong>Material Composition:</strong> Fabric type (e.g., cotton, polyester)</li>
    <li><strong>Color and Pattern:</strong> Dominant colors and patterns</li>
    <li><strong>Fit:</strong> Style and fit of the item (e.g., slim, loose)</li>
</ul>

<h3>Data Structure</h3>
<p>The tags and metadata are stored in Supabase as JSON objects for each user’s wardrobe item, enabling future retrieval and outfit matching.</p>

<h2 id="data-storage">Data Storage</h2>

<p>All data is organized and stored using <strong>Supabase</strong> with the following structure:</p>

<ul>
    <li><strong>Users Table:</strong>
        <ul>
            <li><code>id</code>: Primary user identifier</li>
            <li><code>username</code>: Unique username for each user</li>
            <li><code>avatar_url</code>: URL to profile picture (stored in Cloudinary)</li>
        </ul>
    </li>
    <li><strong>Wardrobe Table:</strong>
        <ul>
            <li><code>id</code>: Unique identifier for each wardrobe item</li>
            <li><code>user_id</code>: Foreign key linking to the user</li>
            <li><code>image_url</code>: Cloudinary URL of the wardrobe item image</li>
            <li><code>tags</code>: JSON object containing tags and metadata for each item</li>
            <li><code>created_at</code>: Timestamp of item addition</li>
        </ul>
    </li>
</ul>

<h2 id="background-removal">Background Removal</h2>

<h3>API Integration</h3>
<p>A background removal API is used to create clean images of each item. The workflow is as follows:</p>
<ol>
    <li><strong>Retrieve Image URL from Cloudinary.</strong></li>
    <li><strong>Send Image to API for Processing:</strong> API removes the background and returns the background-less image.</li>
    <li><strong>Display Processed Image:</strong> Displayed in the app with a transparent background for a polished look.</li>
</ol>

<h2 id="outfit-recommendations">Outfit Recommendations</h2>

<p>The recommendation engine uses compatibility learning to generate outfit suggestions:</p>
<ul>
    <li><strong>Tag-Based Learning:</strong> Based on deep tagging, the model learns compatibility patterns between various items in a user’s wardrobe.</li>
    <li><strong>Compatibility Scoring:</strong> Items are matched based on scores calculated through trained machine learning models.</li>
    <li><strong>Machine Learning Model (TensorFlow/PyTorch):</strong> The model is trained on JSON data of outfits, breaking down items by tags such as color, material, pattern, and fit to learn optimal combinations.</li>
</ul>

<h3>Training and Deployment</h3>
<ol>
    <li><strong>Data Preprocessing:</strong> JSON data of tagged outfits is cleaned and used to train the model.</li>
    <li><strong>Model Training:</strong> Using TensorFlow or a similar library, the model is trained to understand compatibility.</li>
    <li><strong>Deployment in App:</strong> The model is deployed to the app, where it suggests combinations based on items in the user’s wardrobe.</li>
</ol>

<h2 id="profile-navigation">Profile Navigation</h2>

<p>The app includes profile navigation allowing users to view other users’ profiles and outfits:</p>
<ul>
    <li><strong>React Navigation:</strong> Handles routing to other user profiles when a username or avatar is selected.</li>
    <li><strong>Profile Information:</strong> Displays the user’s public wardrobe, allowing for social engagement and inspiration.</li>
</ul>

<h2 id="future-development">Future Development</h2>
<ul>
    <li><strong>3D Visualization:</strong> Incorporate 3D rendering and garment generation to allow users to preview outfits on a customizable avatar, enhancing the Closet screen experience.</li>
    <li><strong>Wishlist Integration:</strong> Enable users to add items to a wishlist, allowing the recommendation engine to suggest combinations that blend wishlist items with wardrobe pieces.</li>
    <li><strong>Marketplace and Item Tracking:</strong> Introduce a buying and selling platform where users can list items in their wardrobe, complete with trend tracking for each item to monitor popularity, wear frequency, and community engagement.</li>
    <li><strong>API Optimization:</strong> Enhance the recommendation API to handle a broader range of tags and item combinations, including compatibility between multiple items for a seamless user experience.</li>
</ul>

<h2 id="license">License</h2>
<p>This project is licensed under the MIT License. See <code>LICENSE</code> for more information.</p>

</body>
</html>
