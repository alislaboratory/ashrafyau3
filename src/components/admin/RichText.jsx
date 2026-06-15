import { useEffect, useRef } from 'react';
import { readImageScaled } from '../../lib/image';

function exec(command, value) {
  document.execCommand(command, false, value);
}

export default function RichText({ value, onChange }) {
  const ref = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (el && el.innerHTML !== (value || '') && document.activeElement !== el) {
      el.innerHTML = value || '';
    }
  }, [value]);

  const emit = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const wrapBlock = (className) => {
    ref.current?.focus();
    const sel = window.getSelection();
    const text = sel && sel.toString();
    if (text) {
      exec('insertHTML', `<div class="${className}">${text}</div><p><br></p>`);
    } else {
      exec('insertHTML', `<div class="${className}">Quote text\u2026</div><p><br></p>`);
    }
    emit();
  };

  const addLink = () => {
    const url = window.prompt('Link URL', 'https://');
    if (url) {
      ref.current?.focus();
      exec('createLink', url);
      emit();
    }
  };

  const onImageFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await readImageScaled(file, 1400, 0.82);
      ref.current?.focus();
      exec('insertHTML', `<img src="${dataUrl}" alt="" /><p><br></p>`);
      emit();
    } catch (err) {
      alert('Could not add image: ' + err.message);
    }
  };

  const Btn = ({ cmd, arg, block, link, img, children, title }) => (
    <button
      type="button"
      className="rt-btn"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        if (img) fileRef.current?.click();
        else if (link) addLink();
        else if (block) wrapBlock(block);
        else {
          ref.current?.focus();
          exec(cmd, arg);
          emit();
        }
      }}
    >
      {children}
    </button>
  );

  return (
    <div className="rt">
      <div className="rt-bar">
        <Btn cmd="bold" title="Bold"><b>B</b></Btn>
        <Btn cmd="italic" title="Italic"><i>I</i></Btn>
        <span className="rt-sep" />
        <Btn cmd="formatBlock" arg="<h2>" title="Heading">H2</Btn>
        <Btn cmd="formatBlock" arg="<p>" title="Paragraph">P</Btn>
        <Btn block="lede" title="Lede (intro paragraph)">Lede</Btn>
        <Btn block="pull" title="Pull quote">&ldquo; Quote</Btn>
        <span className="rt-sep" />
        <Btn cmd="insertUnorderedList" title="Bullet list">&bull; List</Btn>
        <Btn link title="Insert link">Link</Btn>
        <Btn img title="Insert image">Image</Btn>
        <span className="rt-sep" />
        <Btn cmd="removeFormat" title="Clear formatting">Clear</Btn>
      </div>
      <div
        ref={ref}
        className="rt-edit post-body"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
      />
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onImageFile} />
    </div>
  );
}
