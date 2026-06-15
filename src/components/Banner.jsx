import CanvasAnim from './CanvasAnim';

// Unified banner: uploaded image > chosen animation > legacy seed art.
export default function Banner({ item, fallbackSeed, fallbackKind = 'banner', className }) {
  if (item?.image) {
    return <img src={item.image} alt={item.title || item.name || 'banner'} className={className} />;
  }
  if (item?.art) {
    return <CanvasAnim kind="postart" seed={item.art} className={className} />;
  }
  return <CanvasAnim kind={fallbackKind} seed={item?.seed ?? fallbackSeed} className={className} />;
}
