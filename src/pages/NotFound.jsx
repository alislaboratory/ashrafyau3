import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="wrap page-enter">
      <p className="eyebrow">404</p>
      <h1 className="title">Nothing here.</h1>
      <div className="prose">
        <p>That page got advected out of the grid. <Link className="lnk" to="/">Back home &rarr;</Link></p>
      </div>
    </div>
  );
}
