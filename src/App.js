import { Authenticator, Button } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { FileUpload } from './components/FileUpload';
import { ActiveBatches } from './components/ActiveBatches';
import Header from './components/Header';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-north-1_yYMMQDST0",
      userPoolClientId: "27k3sbfkdidhd765e3vgqnc0ic",
      identityPoolId: "eu-north-1:744ae481-84f1-4dec-bc69-0ad36c443940"
    },
  },
})

function App() {
  return (
    <div className="App">
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Header />
        <div className="w-full max-w-md pt-16">
          <Authenticator hideSignUp={true}>
            {({ signOut, user }) => (
              <div>
                <Button onClick={signOut}>Sign out</Button>
                <FileUpload />
                <ActiveBatches />
              </div>
            )}
          </Authenticator>
        </div>
      </div>
    </div>
  );
}

export default App;
