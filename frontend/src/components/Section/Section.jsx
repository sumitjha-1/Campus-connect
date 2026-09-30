import useReveal from '../../hooks/useReveal';
export default function Section({ id, tone, children, className = '', style }) {
  const ref = useReveal();
  return <section ref={ref} id={id} style={style} className={`section reveal ${tone ? 'tone-' + tone : ''} ${className}`}><div className="wrap">{children}</div></section>;
}
