module.exports = {
  apps: [
    {
      name: 'storage-agent',
      script: 'deno run -A -c tsconfig.json --unstable run.ts storage-agent',
      watch: false,
      env: {
        DEBUG: '*',
      },
    },
  ],
}
