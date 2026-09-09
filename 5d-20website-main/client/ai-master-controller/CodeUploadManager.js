/**
 * Code Upload and Management System for Master AI Controller
 * Handles Python, text files, and code storage for AI reference
 */

console.log('📁 Loading Code Upload Manager...');

class CodeUploadManager {
  constructor(masterController) {
    this.masterController = masterController;
    this.uploadedFiles = new Map();
    this.codeDatabase = new Map();
    this.tempMethods = new Map();
    this.aiReferences = new Map();
    this.offlineLibrary = new Map();
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing Code Upload Manager...');
    
    // Setup supported file types
    this.supportedTypes = [
      '.py', '.txt', '.js', '.ts', '.jsx', '.tsx', '.json', '.yaml', '.yml',
      '.md', '.css', '.html', '.sql', '.sh', '.bat', '.ps1', '.xml', '.csv'
    ];
    
    // Initialize code categories
    this.setupCodeCategories();
    
    // Create upload interface
    this.createUploadInterface();
    
    // Setup database storage
    this.setupDatabaseStorage();
    
    console.log('✅ Code Upload Manager operational');
  }

  setupCodeCategories() {
    this.codeCategories = new Map([
      ['python', { 
        extensions: ['.py'], 
        description: 'Python scripts and modules',
        icon: '🐍',
        parser: this.parsePythonCode.bind(this)
      }],
      ['javascript', { 
        extensions: ['.js', '.jsx', '.ts', '.tsx'], 
        description: 'JavaScript and TypeScript files',
        icon: '📜',
        parser: this.parseJavaScriptCode.bind(this)
      }],
      ['text', { 
        extensions: ['.txt', '.md'], 
        description: 'Text files and documentation',
        icon: '📝',
        parser: this.parseTextFile.bind(this)
      }],
      ['config', { 
        extensions: ['.json', '.yaml', '.yml', '.xml'], 
        description: 'Configuration files',
        icon: '⚙️',
        parser: this.parseConfigFile.bind(this)
      }],
      ['web', { 
        extensions: ['.html', '.css'], 
        description: 'Web development files',
        icon: '🌐',
        parser: this.parseWebFile.bind(this)
      }],
      ['data', { 
        extensions: ['.csv', '.sql'], 
        description: 'Data and database files',
        icon: '📊',
        parser: this.parseDataFile.bind(this)
      }],
      ['scripts', { 
        extensions: ['.sh', '.bat', '.ps1'], 
        description: 'Shell and batch scripts',
        icon: '⚡',
        parser: this.parseScriptFile.bind(this)
      }]
    ]);
  }

  createUploadInterface() {
    // Create file upload dropzone
    this.uploadZone = document.createElement('div');
    this.uploadZone.id = 'code-upload-zone';
    this.uploadZone.style.display = 'none';
    this.uploadZone.innerHTML = this.getUploadZoneHTML();
    
    document.body.appendChild(this.uploadZone);
    
    // Setup drag and drop
    this.setupDragAndDrop();
    
    // Setup file input
    this.setupFileInput();
  }

  getUploadZoneHTML() {
    return `
      <div style="
        position: fixed; 
        top: 100px; 
        left: 50%; 
        transform: translateX(-50%); 
        width: 600px; 
        background: rgba(0, 0, 0, 0.95); 
        border: 2px solid #8b5cf6; 
        border-radius: 12px; 
        padding: 20px; 
        z-index: 10000;
        color: white;
      ">
        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0; color: #8b5cf6; font-size: 18px;">📁 Code Upload Manager</h3>
          <button onclick="window.codeUploadManager.closeUploadZone()" 
                  style="background: none; border: none; color: #8b5cf6; cursor: pointer; font-size: 20px; float: right;">×</button>
        </div>
        
        <div id="upload-dropzone" style="
          border: 2px dashed #8b5cf6; 
          border-radius: 8px; 
          padding: 40px; 
          text-align: center; 
          margin-bottom: 20px;
          transition: all 0.3s ease;
        ">
          <div style="font-size: 48px; margin-bottom: 10px;">📁</div>
          <p style="margin: 0; font-size: 16px; color: #ccc;">Drop code files here or click to browse</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #888;">
            Supported: ${this.supportedTypes.join(', ')}
          </p>
          <input type="file" id="code-file-input" multiple accept="${this.supportedTypes.join(',')}" 
                 style="display: none;">
        </div>
        
        <div id="upload-progress" style="display: none; margin-bottom: 20px;">
          <div style="background: rgba(255,255,255,0.1); border-radius: 4px; height: 8px; overflow: hidden;">
            <div id="progress-bar" style="background: #8b5cf6; height: 100%; width: 0%; transition: width 0.3s;"></div>
          </div>
          <p id="progress-text" style="margin: 5px 0 0 0; font-size: 12px; color: #ccc;"></p>
        </div>
        
        <div id="uploaded-files-list" style="max-height: 200px; overflow-y: auto;">
          <!-- Uploaded files will appear here -->
        </div>
        
        <div style="margin-top: 20px; display: flex; gap: 10px;">
          <button onclick="window.codeUploadManager.processAllFiles()" 
                  style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🔄 Process Files
          </button>
          <button onclick="window.codeUploadManager.saveToDatabase()" 
                  style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            💾 Save to Database
          </button>
          <button onclick="window.codeUploadManager.createOfflineLibrary()" 
                  style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            📚 Create Library
          </button>
        </div>
      </div>
    `;
  }

  setupDragAndDrop() {
    const dropzone = () => document.getElementById('upload-dropzone');
    
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (dropzone()) {
        dropzone().style.borderColor = '#10b981';
        dropzone().style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
      }
    });
    
    document.addEventListener('dragleave', (e) => {
      e.preventDefault();
      if (dropzone()) {
        dropzone().style.borderColor = '#8b5cf6';
        dropzone().style.backgroundColor = 'transparent';
      }
    });
    
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      if (dropzone()) {
        dropzone().style.borderColor = '#8b5cf6';
        dropzone().style.backgroundColor = 'transparent';
      }
      
      if (this.uploadZone.style.display !== 'none') {
        this.handleFilesDrop(e.dataTransfer.files);
      }
    });
  }

  setupFileInput() {
    document.addEventListener('click', (e) => {
      if (e.target.id === 'upload-dropzone') {
        document.getElementById('code-file-input').click();
      }
    });
    
    document.addEventListener('change', (e) => {
      if (e.target.id === 'code-file-input') {
        this.handleFilesDrop(e.target.files);
      }
    });
  }

  setupDatabaseStorage() {
    this.databaseStorage = {
      connect: () => this.connectToDatabase(),
      store: (data) => this.storeInDatabase(data),
      retrieve: (key) => this.retrieveFromDatabase(key),
      search: (query) => this.searchDatabase(query)
    };
  }

  showUploadZone() {
    this.uploadZone.style.display = 'block';
  }

  closeUploadZone() {
    this.uploadZone.style.display = 'none';
  }

  async handleFilesDrop(files) {
    const fileArray = Array.from(files);
    let processedCount = 0;
    
    this.showProgress(0, `Processing ${fileArray.length} files...`);
    
    for (const file of fileArray) {
      if (this.isSupportedFile(file.name)) {
        await this.processFile(file);
        processedCount++;
        this.showProgress((processedCount / fileArray.length) * 100, 
          `Processed ${processedCount}/${fileArray.length} files`);
      }
    }
    
    this.hideProgress();
    this.updateFilesList();
  }

  isSupportedFile(filename) {
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return this.supportedTypes.includes(extension);
  }

  async processFile(file) {
    try {
      const content = await this.readFileContent(file);
      const category = this.categorizeFile(file.name);
      const parsedData = await this.parseFileContent(file.name, content, category);
      
      const fileData = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        category,
        content,
        parsedData,
        uploaded: Date.now(),
        accessible: true
      };
      
      this.uploadedFiles.set(fileData.id, fileData);
      this.addToOfflineLibrary(fileData);
      
      console.log(`📁 Processed file: ${file.name} (${category})`);
      return fileData;
      
    } catch (error) {
      console.error(`Failed to process file ${file.name}:`, error);
      return null;
    }
  }

  readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  categorizeFile(filename) {
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    
    for (const [category, config] of this.codeCategories) {
      if (config.extensions.includes(extension)) {
        return category;
      }
    }
    
    return 'other';
  }

  async parseFileContent(filename, content, category) {
    const categoryConfig = this.codeCategories.get(category);
    
    if (categoryConfig && categoryConfig.parser) {
      return await categoryConfig.parser(filename, content);
    }
    
    return this.parseGenericFile(filename, content);
  }

  parsePythonCode(filename, content) {
    const parsed = {
      type: 'python',
      functions: [],
      classes: [],
      imports: [],
      variables: [],
      comments: []
    };
    
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Extract functions
      if (trimmed.startsWith('def ')) {
        const match = trimmed.match(/def\s+(\w+)\s*\(/);
        if (match) {
          parsed.functions.push({
            name: match[1],
            line: index + 1,
            signature: trimmed
          });
        }
      }
      
      // Extract classes
      if (trimmed.startsWith('class ')) {
        const match = trimmed.match(/class\s+(\w+)/);
        if (match) {
          parsed.classes.push({
            name: match[1],
            line: index + 1,
            definition: trimmed
          });
        }
      }
      
      // Extract imports
      if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
        parsed.imports.push({
          statement: trimmed,
          line: index + 1
        });
      }
      
      // Extract comments
      if (trimmed.startsWith('#')) {
        parsed.comments.push({
          text: trimmed,
          line: index + 1
        });
      }
    });
    
    return parsed;
  }

  parseJavaScriptCode(filename, content) {
    const parsed = {
      type: 'javascript',
      functions: [],
      classes: [],
      imports: [],
      exports: [],
      variables: []
    };
    
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Extract functions
      const functionMatch = trimmed.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=.*=>|(\w+)\s*:\s*function)/);
      if (functionMatch) {
        parsed.functions.push({
          name: functionMatch[1] || functionMatch[2] || functionMatch[3],
          line: index + 1,
          signature: trimmed
        });
      }
      
      // Extract classes
      const classMatch = trimmed.match(/class\s+(\w+)/);
      if (classMatch) {
        parsed.classes.push({
          name: classMatch[1],
          line: index + 1,
          definition: trimmed
        });
      }
      
      // Extract imports
      if (trimmed.startsWith('import ') || trimmed.includes('require(')) {
        parsed.imports.push({
          statement: trimmed,
          line: index + 1
        });
      }
      
      // Extract exports
      if (trimmed.startsWith('export ') || trimmed.includes('module.exports')) {
        parsed.exports.push({
          statement: trimmed,
          line: index + 1
        });
      }
    });
    
    return parsed;
  }

  parseTextFile(filename, content) {
    return {
      type: 'text',
      lines: content.split('\n').length,
      words: content.split(/\s+/).length,
      characters: content.length,
      sections: this.extractTextSections(content)
    };
  }

  parseConfigFile(filename, content) {
    try {
      if (filename.endsWith('.json')) {
        return {
          type: 'json',
          data: JSON.parse(content),
          keys: Object.keys(JSON.parse(content))
        };
      } else if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
        return {
          type: 'yaml',
          content: content,
          lines: content.split('\n').length
        };
      }
    } catch (error) {
      return {
        type: 'config',
        error: 'Parse error: ' + error.message,
        content: content
      };
    }
  }

  parseWebFile(filename, content) {
    if (filename.endsWith('.html')) {
      return {
        type: 'html',
        elements: (content.match(/<[^>]+>/g) || []).length,
        scripts: (content.match(/<script[^>]*>/g) || []).length,
        styles: (content.match(/<style[^>]*>/g) || []).length
      };
    } else if (filename.endsWith('.css')) {
      return {
        type: 'css',
        rules: (content.match(/[^{}]+\{[^{}]*\}/g) || []).length,
        selectors: (content.match(/[^{]+(?=\{)/g) || []).length
      };
    }
  }

  parseDataFile(filename, content) {
    if (filename.endsWith('.csv')) {
      const lines = content.split('\n');
      return {
        type: 'csv',
        rows: lines.length,
        columns: lines[0] ? lines[0].split(',').length : 0,
        headers: lines[0] ? lines[0].split(',') : []
      };
    } else if (filename.endsWith('.sql')) {
      return {
        type: 'sql',
        statements: (content.match(/;\s*$/gm) || []).length,
        tables: (content.match(/CREATE TABLE\s+(\w+)/gi) || []).length
      };
    }
  }

  parseScriptFile(filename, content) {
    return {
      type: 'script',
      lines: content.split('\n').length,
      commands: content.split('\n').filter(line => line.trim() && !line.trim().startsWith('#')).length
    };
  }

  parseGenericFile(filename, content) {
    return {
      type: 'generic',
      size: content.length,
      lines: content.split('\n').length,
      content: content.substring(0, 500) // First 500 chars
    };
  }

  extractTextSections(content) {
    const sections = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.trim().length > 0 && (line.startsWith('#') || line.toUpperCase() === line)) {
        sections.push({
          title: line.trim(),
          line: index + 1
        });
      }
    });
    
    return sections;
  }

  addToOfflineLibrary(fileData) {
    const libraryEntry = {
      id: fileData.id,
      name: fileData.name,
      category: fileData.category,
      summary: this.generateFileSummary(fileData),
      searchableContent: this.extractSearchableContent(fileData),
      aiUsable: true,
      added: Date.now()
    };
    
    this.offlineLibrary.set(fileData.id, libraryEntry);
    console.log(`📚 Added to offline library: ${fileData.name}`);
  }

  generateFileSummary(fileData) {
    const { parsedData, category } = fileData;
    
    switch (category) {
      case 'python':
        return `Python file with ${parsedData.functions.length} functions, ${parsedData.classes.length} classes`;
      case 'javascript':
        return `JavaScript file with ${parsedData.functions.length} functions, ${parsedData.classes.length} classes`;
      case 'text':
        return `Text file with ${parsedData.lines} lines, ${parsedData.words} words`;
      default:
        return `${category} file (${fileData.size} bytes)`;
    }
  }

  extractSearchableContent(fileData) {
    const { content, parsedData, category } = fileData;
    let searchable = [fileData.name];
    
    if (parsedData.functions) {
      searchable.push(...parsedData.functions.map(f => f.name));
    }
    
    if (parsedData.classes) {
      searchable.push(...parsedData.classes.map(c => c.name));
    }
    
    if (parsedData.keys) {
      searchable.push(...parsedData.keys);
    }
    
    // Add first 1000 characters of content
    searchable.push(content.substring(0, 1000));
    
    return searchable.join(' ').toLowerCase();
  }

  createTempMethod(methodName, code, description) {
    const tempMethod = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: methodName,
      code,
      description,
      created: Date.now(),
      tested: false,
      saved: false,
      aiGenerated: true
    };
    
    this.tempMethods.set(tempMethod.id, tempMethod);
    
    // Save to database
    this.saveToDatabase('temp_methods', tempMethod);
    
    console.log(`🔧 Created temporary method: ${methodName}`);
    return tempMethod.id;
  }

  testTempMethod(methodId) {
    const method = this.tempMethods.get(methodId);
    if (!method) return false;
    
    try {
      // Create a safe testing environment
      const testResult = this.executeInSandbox(method.code);
      
      method.tested = true;
      method.testResult = testResult;
      method.testTime = Date.now();
      
      console.log(`✅ Tested method ${method.name}: ${testResult.success ? 'PASS' : 'FAIL'}`);
      return testResult.success;
      
    } catch (error) {
      method.tested = true;
      method.testResult = { success: false, error: error.message };
      method.testTime = Date.now();
      
      console.error(`❌ Test failed for method ${method.name}:`, error);
      return false;
    }
  }

  executeInSandbox(code) {
    // Simple sandbox execution (in production, use a proper sandbox)
    try {
      const result = eval(`(function() { ${code} })()`);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  saveTempMethodAsPermanent(methodId) {
    const method = this.tempMethods.get(methodId);
    if (!method || !method.tested) return false;
    
    method.saved = true;
    method.permanent = true;
    method.savedTime = Date.now();
    
    // Save to permanent database
    this.saveToDatabase('permanent_methods', method);
    
    console.log(`💾 Saved method ${method.name} as permanent`);
    return true;
  }

  searchOfflineLibrary(query) {
    const results = [];
    const queryLower = query.toLowerCase();
    
    this.offlineLibrary.forEach((entry, id) => {
      if (entry.searchableContent.includes(queryLower) || 
          entry.name.toLowerCase().includes(queryLower)) {
        results.push({
          ...entry,
          relevance: this.calculateRelevance(entry, queryLower)
        });
      }
    });
    
    return results.sort((a, b) => b.relevance - a.relevance);
  }

  calculateRelevance(entry, query) {
    let score = 0;
    
    if (entry.name.toLowerCase().includes(query)) score += 10;
    if (entry.category.includes(query)) score += 5;
    if (entry.searchableContent.includes(query)) score += 1;
    
    return score;
  }

  getAIReference(category, topic) {
    const references = [];
    
    this.offlineLibrary.forEach((entry) => {
      if (entry.category === category || entry.searchableContent.includes(topic.toLowerCase())) {
        references.push(entry);
      }
    });
    
    return references;
  }

  processAllFiles() {
    console.log('🔄 Processing all uploaded files...');
    
    this.uploadedFiles.forEach((file) => {
      // Additional processing for AI reference
      this.createAIReference(file);
    });
    
    alert(`Processed ${this.uploadedFiles.size} files for AI reference`);
  }

  createAIReference(fileData) {
    const aiRef = {
      fileId: fileData.id,
      category: fileData.category,
      usageInstructions: this.generateUsageInstructions(fileData),
      codeExamples: this.extractCodeExamples(fileData),
      aiAccessible: true,
      created: Date.now()
    };
    
    this.aiReferences.set(fileData.id, aiRef);
  }

  generateUsageInstructions(fileData) {
    switch (fileData.category) {
      case 'python':
        return 'Use this Python code as reference for function implementations and class structures';
      case 'javascript':
        return 'Reference this JavaScript code for web development patterns and methods';
      case 'text':
        return 'Use this text file for documentation and information reference';
      default:
        return 'General code reference file for development assistance';
    }
  }

  extractCodeExamples(fileData) {
    const examples = [];
    
    if (fileData.parsedData.functions) {
      fileData.parsedData.functions.forEach(func => {
        examples.push({
          type: 'function',
          name: func.name,
          code: func.signature,
          line: func.line
        });
      });
    }
    
    return examples;
  }

  async saveToDatabase() {
    console.log('💾 Saving to database...');
    
    try {
      // Save uploaded files
      await this.storeInDatabase('uploaded_files', Array.from(this.uploadedFiles.values()));
      
      // Save offline library
      await this.storeInDatabase('offline_library', Array.from(this.offlineLibrary.values()));
      
      // Save AI references
      await this.storeInDatabase('ai_references', Array.from(this.aiReferences.values()));
      
      // Save temp methods
      await this.storeInDatabase('temp_methods', Array.from(this.tempMethods.values()));
      
      alert('All data saved to database successfully!');
      
    } catch (error) {
      console.error('Database save failed:', error);
      alert('Failed to save to database: ' + error.message);
    }
  }

  async storeInDatabase(collection, data) {
    // Use Master AI Controller's database connection
    if (this.masterController.databaseConnector) {
      return await this.masterController.sendDatabaseRequest({
        action: 'store',
        collection,
        data,
        timestamp: Date.now()
      });
    } else {
      // Fallback to localStorage
      localStorage.setItem(`codeUpload_${collection}`, JSON.stringify(data));
      return true;
    }
  }

  async retrieveFromDatabase(collection) {
    if (this.masterController.databaseConnector) {
      return await this.masterController.sendDatabaseRequest({
        action: 'retrieve',
        collection,
        timestamp: Date.now()
      });
    } else {
      const data = localStorage.getItem(`codeUpload_${collection}`);
      return data ? JSON.parse(data) : null;
    }
  }

  createOfflineLibrary() {
    console.log('📚 Creating offline library...');
    
    const library = {
      files: Array.from(this.uploadedFiles.values()),
      references: Array.from(this.aiReferences.values()),
      tempMethods: Array.from(this.tempMethods.values()),
      created: Date.now(),
      version: '1.0'
    };
    
    // Save as downloadable JSON
    const blob = new Blob([JSON.stringify(library, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-code-library-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    console.log('📚 Offline library created and downloaded');
  }

  showProgress(percent, text) {
    const progressElement = document.getElementById('upload-progress');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressElement && progressBar && progressText) {
      progressElement.style.display = 'block';
      progressBar.style.width = `${percent}%`;
      progressText.textContent = text;
    }
  }

  hideProgress() {
    const progressElement = document.getElementById('upload-progress');
    if (progressElement) {
      progressElement.style.display = 'none';
    }
  }

  updateFilesList() {
    const listElement = document.getElementById('uploaded-files-list');
    if (!listElement) return;
    
    const filesHTML = Array.from(this.uploadedFiles.values()).map(file => {
      const category = this.codeCategories.get(file.category);
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; margin: 4px 0; background: rgba(255,255,255,0.1); border-radius: 4px;">
          <div>
            <span style="margin-right: 8px;">${category ? category.icon : '📄'}</span>
            <span style="font-weight: bold;">${file.name}</span>
            <span style="font-size: 11px; color: #ccc; margin-left: 8px;">(${(file.size / 1024).toFixed(1)} KB)</span>
          </div>
          <div>
            <button onclick="window.codeUploadManager.previewFile('${file.id}')" 
                    style="background: #3b82f6; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 11px; margin-right: 4px;">
              👁️ Preview
            </button>
            <button onclick="window.codeUploadManager.removeFile('${file.id}')" 
                    style="background: #ef4444; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 11px;">
              🗑️ Remove
            </button>
          </div>
        </div>
      `;
    }).join('');
    
    listElement.innerHTML = filesHTML;
  }

  previewFile(fileId) {
    const file = this.uploadedFiles.get(fileId);
    if (!file) return;
    
    const preview = `
File: ${file.name}
Category: ${file.category}
Size: ${(file.size / 1024).toFixed(1)} KB
Uploaded: ${new Date(file.uploaded).toLocaleString()}

Content Preview:
${file.content.substring(0, 500)}${file.content.length > 500 ? '...' : ''}

Parsed Data:
${JSON.stringify(file.parsedData, null, 2)}
    `;
    
    alert(preview);
  }

  removeFile(fileId) {
    if (confirm('Remove this file from the upload list?')) {
      this.uploadedFiles.delete(fileId);
      this.offlineLibrary.delete(fileId);
      this.aiReferences.delete(fileId);
      this.updateFilesList();
    }
  }

  getUploadStats() {
    return {
      totalFiles: this.uploadedFiles.size,
      totalSize: Array.from(this.uploadedFiles.values()).reduce((sum, file) => sum + file.size, 0),
      categories: this.getCategoryStats(),
      aiReferences: this.aiReferences.size,
      tempMethods: this.tempMethods.size
    };
  }

  getCategoryStats() {
    const stats = {};
    this.uploadedFiles.forEach(file => {
      stats[file.category] = (stats[file.category] || 0) + 1;
    });
    return stats;
  }

  ping() {
    return {
      service: 'CodeUploadManager',
      status: 'active',
      uploadedFiles: this.uploadedFiles.size,
      offlineLibrary: this.offlineLibrary.size,
      tempMethods: this.tempMethods.size,
      aiReferences: this.aiReferences.size,
      health: 'healthy'
    };
  }
}

// Export for use by Master AI Controller
window.CodeUploadManager = CodeUploadManager;

console.log('✅ Code Upload Manager loaded');
