import { Link } from 'react-router-dom';
export default function Button({ to, href, variant = 'primary', children, ...rest }) {
  const cls = `btn btn-${variant}`;
  if (href) return <a className={cls} href={href} {...rest}>{children}</a>;
  if (to) return <Link className={cls} to={to} {...rest}>{children}</Link>;
  return <button className={cls} {...rest}>{children}</button>;
}
