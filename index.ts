import app from './app';
import settings from 'settings';

app.listen(settings.port, () => {
  console.log(`Server up and running on port ${settings.port}`);
});
