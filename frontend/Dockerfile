# Use the official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Expose port 5173 (default Vite dev server port)
EXPOSE 3000

# Copy the source code
COPY . .

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
