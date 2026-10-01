from __future__ import annotations

from pathlib import Path

from lxml import etree


def discover_xml_files(manifest_path: str) -> list:
    """Catalog-driven discovery: <file> entries plus <dir> templates.

    Stays agnostic: the manifest alone decides what gets validated; a <dir>
    template is a path pattern with a {Name} placeholder (expanded to '*').
    """
    xml_files = []
    manifest_dir = str(Path(manifest_path).parent)
    try:
        doc = etree.parse(manifest_path)
    except etree.XMLSyntaxError:
        return xml_files
    for elem in doc.iter():
        tag = etree.QName(elem.tag).localname if "{" in elem.tag else elem.tag
        if tag == "catalog":
            file_elem = elem.find("{urn:flipova:foundation:registry}file")
            if file_elem is not None and file_elem.text:
                xml_files.append(str(Path(manifest_dir) / file_elem.text))
            dir_elem = elem.find("{urn:flipova:foundation:registry}dir")
            if dir_elem is not None and dir_elem.text:
                pattern = dir_elem.text.strip().replace("{Name}", "*")
                xml_files.extend(str(p) for p in sorted(Path(manifest_dir).glob(pattern)))
    return sorted(set(xml_files))
