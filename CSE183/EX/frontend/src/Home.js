import React from 'react';
import './Home.css'; 

const fetchBooks = (setBooks, setError) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch("/v0/books", {
      method: 'get',
      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`, 
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    })
    .then((response) => {
      if (!response.ok) { throw response }
      return response.json()  
    })
    .then((json) => {
      setError('');
      setBooks(json);
    })
    .catch((error) => {
      console.log(error);
      setBooks([]);
      setError(`${error.status} - ${error.statusText}`);
    })
};

/**
 * @return {object} JSX Table
 */
function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [books, setBooks] = React.useState([]);
  const [name, setName] = React.useState(user ? user.name : '');
  const [error, setError] = React.useState('Logged Out');

  const logout = () => {
    localStorage.setItem('bearerToken', '');
    setBooks([]);
    setName('');
    setError('Logged Out');
  };

  React.useEffect(() => {
    fetchBooks(setBooks, setError);
  }, []);

  return (
    <div>
      <h2 id='welcome'>CSE183 Authenticated Books Example</h2>
      <a href='/Login'>Login</a>
      <button disabled={!name} onClick={logout}>Logout</button>
      <label>{name ? name : ''}</label>
      <p/>
      <table id='books'>
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
          </tr>
        </thead>
        <tbody>
          {books.sort((a, b) => (a.title > b.title) ? 1 : -1).map((book) => (
            <tr key={book.isbn} id={'isbn'+book.isbn}>
              <td>{book.isbn}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
            </tr>
          ))}
          <tr key={'error'}>
            <td colSpan={4}>{error}</td>
          </tr>
        </tbody>
      </table> 
    </div>
  );
}

export default Home;
