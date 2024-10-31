# 1. Use an official Node.js runtime as a parent image
FROM node:18-alpine AS builder

# 2. Set the working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the application code
COPY . .

# 6. Build the Next.js app
RUN npm run build

# --- Production Stage ---
FROM node:18-alpine AS production

# 7. Set the working directory
WORKDIR /app

# 8. Copy only the built files and necessary dependencies for production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 9. Set environment variables (if needed)
ENV NODE_ENV=production
ENV PORT=3000

# 10. Expose the port that your app runs on
EXPOSE 3000

# 11. Start the Next.js app
CMD ["npm", "start"]

