import { Authenticator, Button } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { FileUpload } from './components/FileUpload';
import { ActiveBatches } from './components/ActiveBatches';
import Header from './components/Header';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-central-1_hvefWKI1S",
      userPoolClientId: "4pqp5ilnifph26ctveg78oc7kk",
      identityPoolId: "eu-central-1:0f9f60e7-da4a-4bfd-8857-2743a3be9de4"
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
                <div className="sign-out-button">
                  <Button onClick={signOut}>Sign out</Button>
                </div>
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
