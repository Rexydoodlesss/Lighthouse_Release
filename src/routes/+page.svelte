<script>
  let password = 'hallo';
  let spreadsheet = '';
  let sheetData = [];
  import Papa from 'papaparse';
  
  async function handleLogin() {
    if (password) {
      if (password) {
        try {
          const response = await fetch('/chezy.csv');
          const csvText = await response.text();
          const parsedData = Papa.parse(csvText, { header: true });
          const rawArray = convertToRawArray(parsedData.data);
          sheetData = rawArray;
          console.log('Parsed SheetData:', sheetData);
          localStorage.setItem('sheetData', JSON.stringify(sheetData));
          localStorage.setItem('isAuthenticated', true);
          alert('Login successful! Data has been loaded.');
          window.location.href = '/pageWithStats';
        } catch (error) {
          console.error('Error loading chezy.csv:', error);
          alert('Failed to load data from the file.');
        }
      } else {
        alert('Incorrect password. Please try again.');
      }
    } else {
      alert('Please enter a password.');
    }
  }
  function convertToRawArray(data) {
    if (data.length === 0) return [];
    const headers = Object.keys(data[0]);
    const rows = data.map((row) => headers.map((key) => row[key]));
    return [headers, ...rows];
  } 
</script>
  
<style>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #4e54c8, #8f94fb);
    font-family: 'Arial', sans-serif;
    color: #fff;
  }
  
  h1 {
    margin-bottom: 2rem;
    font-size: 2.5rem;
  }
  
  .input-group {
    position: relative;
    margin-bottom: 1.5rem;
    width: 100%;
    max-width: 400px;
  }
  
  input {
    width: 100%;
    padding: 1rem 0.5rem;
    border: 2px solid #fff;
    border-radius: 5px;
    font-size: 1rem;
    background: transparent;
    color: #fff;
    outline: none;
  }
  
  input::placeholder {
    color: transparent;
    transition: transform 0.3s ease, font-size 0.3s ease;
  }
  
  .input-group label {
    position: absolute;
    top: 50%;
    left: 0.5rem;
    transform: translateY(-50%);
    color: #fff;
    font-size: 1rem;
    pointer-events: none;
    transition: transform 0.3s ease, font-size 0.3s ease;
  }
  
  input:focus + label,
  input:not(:placeholder-shown) + label {
    transform: translateY(-150%);
    font-size: 0.8rem;
  }
  
  button {
    padding: 0.8rem 2rem;
    border: none;
    border-radius: 5px;
    background-color: #6c63ff;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #5753c9;
  }
</style>
  
<div class="login-container">
  <h1>Welcome to Lighthouse</h1>
  <button on:click={handleLogin}>Continue</button>
</div>
