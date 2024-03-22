module.exports = {
  apps: [
    /**
     * @description Backend
     */
    {
      name: "SALARY_HERO: Backend API",
      script: "DISABLE_SCHEDULE_JOB=true node ./dist/main.js",
      autorestart: true,
    },
    /**
     * @description Salary Task Schedule
     */
    {
      name: "SALARY_HERO: Task Schedule (Kafka Provider)",
      script: "NODE_PORT=3001 node ./dist/main.js",
      autorestart: true,
    },
    /**
     * @description Consumer calculate worker salary
     */
    {
      name: "SALARY_HERO: Console Job Handle Salary (Kafka Consumer)",
      script: "node ./dist/console.js calculate-worker-salary",
      autorestart: true,
      cron_restart: "1 0 * * *",
    },
  ],
};
