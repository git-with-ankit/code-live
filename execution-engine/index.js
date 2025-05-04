const express = require('express');
const cors = require('cors');
const Docker = require('dockerode');
const app = express();
const docker = new Docker();

app.use(express.json());

app.use(cors());

app.post('/execute', async (req, res) => {
    const { code, language } = req.body;
  
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invalid code' });
    }
  
    try {
      const container = await docker.createContainer({
        Image: 'code-live-js-sandbox',
        Cmd: ['sh', '-c', 'sleep 1'], // Keep container alive briefly
        AttachStdout: true,
        AttachStderr: true,
        HostConfig: {
          AutoRemove: true, // Cleanup after exit
          ReadonlyRootfs: true,
          NetworkMode: 'none'
        }
      });
  
      await container.start();
  
      // Use `exec` instead of embedding code in Cmd
      const exec = await container.exec({
        Cmd: ['node', '-e', code],
        AttachStdout: true,
        AttachStderr: true
      });
  
      let output = '';
      const stream = await exec.start({ hijack: true, stdin: false });
      stream.on('data', (chunk) =>{
        const payload = chunk.slice(8);
        output += payload.toString('utf-8');
      });
      stream.on('end', () => res.json({ output: output.trim() }));
  
    } catch (err) {
      res.status(500).json({ 
        error: 'Execution failed',
        details: err.message 
      });
    }
  });

app.listen(4000,()=>{
    console.log("Execution api running on port 4000")
})