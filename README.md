# 📊 YouTube Trending Videos Analyzer

**Context** This was made as a course project of CS661 under professor Soumya Dutta 


**YouTube Trending Videos Analyzer** is a web application built with **Next.js** that helps users explore and visualize trending YouTube video data.  
It uses a variety of powerful charts and visual tools to analyze likes, views, comments, and dislikes across different categories and countries.

## ✨ Features

- 🔍 **Visual Analysis**  
  - **Line Chart**: View trends over time.
  - **World Map**: See how engagement varies across countries.
  - **Word Cloud**: Explore trending keywords in video titles.
  - **Heat Map**: Analyze engagement patterns across different times and categories.
  - **Correlation Matrix**: Understand relationships between likes, views, comments, and dislikes.
  - **Bar Chart**: Compare different metrics side-by-side.

- 📈 **Prediction Page**  
  - Input **tags**, **video duration**, **category**, and **country**.
  - Get predicted **likes**, **views**, **comments**, and **dislikes**.
  - Visualize predictions using a **bar chart** and a **pie chart**.

## 🚀 Tech Stack

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) (for graph visualizations)
- [D3.js](https://d3js.org) (for map visulization and world cloud)
- [Shadcn](https://ui.shadcn.com/) (component library in tailwind css)
- [Machine Learning Model] (for predictions made in python)

## 📂 Project Structure

```bash
/pages
  ├── page.tsx           # Homepage
  ├── bar-chart.tsx      # Line Chart analysis
  ├── word-cloud.tsx      # Trending tags visualization
  ├── world-map.tsx      # Map view
  ├── heat-map.tsx        # Engagement heatmap
  ├── correlation-matrix.tsx # Correlation analysis
  ├── radar.tsx       # Radar chart
  ├── prediction.tsx         # Likes/Views/Comments/Dislikes predictor
```

## 🛠️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/depanshu357/youtube-trending-videos-analyzer.git
   cd youtube-trending-videos-analyzer.git
   ```

2. **Install dependencies:**
   ```bash
   npm install --force
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Visit:**  
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📈 Usage

- Navigate through different charts from the sidebar or menu.
- Select **Country** and **Category** filters to refine your analysis.
- On the **Prediction** page, enter:
  - Tags (comma separated)
  - Video duration (in seconds)
  - Category
  - Country
- Submit to view predicted engagement metrics in a neat bar chart.


---