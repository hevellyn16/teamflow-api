import { app } from './app';
import { env } from './env';


app.listen({ port: env.PORT, host: '0.0.0.0' }, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});

app.get('/', async () => {
  return { message: 'API TeamFlow está no ar!' }
})
