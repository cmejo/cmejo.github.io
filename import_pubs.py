
#!/usr/bin/env python3
import sys, os, re, argparse, datetime

def parse_bibtex(text):
    entries = []
    pattern = re.compile(r'@(?P<type>\w+)\s*\{\s*(?P<key>[^,]+),(?P<body>.*?)\n\}\s*', re.DOTALL)
    fields_re = re.compile(r'(?P<field>\w+)\s*=\s*(?P<value>\{.*?\}|\".*?\"),?', re.DOTALL)
    for m in pattern.finditer(text):
        key = m.group('key').strip()
        body = m.group('body')
        fields = {}
        for f in fields_re.finditer(body):
            val = f.group('value').strip()
            if val.startswith('{') and val.endswith('}'): val = val[1:-1]
            if val.startswith('"') and val.endswith('"'): val = val[1:-1]
            fields[f.group('field').lower()] = ' '.join(val.split())
        entries.append((key, fields))
    return entries

def to_filename(key, title):
    safe = re.sub(r'[^a-zA-Z0-9_-]', '-', (title or key).lower())[:60]
    return safe + '.md'

def mk_md(key, f, outdir):
    title = f.get('title', key)
    authors = f.get('author','')
    year = f.get('year','')
    venue = f.get('journal') or f.get('booktitle') or f.get('publisher') or ''
    date = f.get('date') or (year+'-01-01' if year else datetime.date.today().isoformat())
    md = ['---',
          f'title: "{title}"',
          f'authors: "{authors}"',
          f'venue: "{venue}"',
          f'year: "{year}"',
          f'date: {date}']
    if 'doi' in f: md.append(f'doi: "{f.get("doi")}"')
    if 'url' in f: md.append(f'url: "{f.get("url")}"')
    if 'pdf' in f: md.append(f'pdf: "{f.get("pdf")}"')
    md.append('---\n')
    if 'abstract' in f: md.append(f['abstract'])
    fname = to_filename(key, title)
    with open(os.path.join(outdir, fname), 'w', encoding='utf-8') as w:
        w.write('\n'.join(md))
    print("Wrote", fname)

def main():
    p = argparse.ArgumentParser()
    p.add_argument('bib')
    p.add_argument('--out', default='_publications')
    args = p.parse_args()
    with open(args.bib,'r',encoding='utf-8') as f: text=f.read()
    entries = parse_bibtex(text)
    os.makedirs(args.out, exist_ok=True)
    for key, f in entries:
        mk_md(key,f,args.out)

if __name__=='__main__': main()
