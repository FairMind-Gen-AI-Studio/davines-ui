import { FileUpload } from './components/FileUpload';
import { ActiveBatches } from './components/ActiveBatches';
import './components/FileUpload.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <div className="logo-container">
          <img
            src="/fairmind-logo.png"
            alt="Fairmind Logo"
            className="logo"
          />
        </div>
        <h1>AI Information Extractor</h1>
        <div className="logo-container">
          <img
            src="/davines-logo.svg"
            alt="Daviness Logo"
            className="logo"
          />
        </div>
      </header>

      <FileUpload />
      <ActiveBatches />
    </div>
  );
}

export default App;
