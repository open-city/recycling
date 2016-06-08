import urllib
import json
from os.path import join, dirname, abspath

base_url = 'http://ocd.datamade.us'
org_id = 'ocd-organization/ef168607-9135-4177-ad8e-c1f7a4806c3a'

out_path = abspath(join(dirname(__file__), '..', 'migrations', 'data', 'wards'))

def iter_members():
    org_url = '{0}/{1}'.format(base_url, org_id)

    resp = json.load(urllib.urlopen(org_url))

    for ward in resp['memberships']:
        yield ward

def load_person(ward):
    person_id = ward['person']['id']
    person_url = '{0}/{1}'.format(base_url, person_id)
    
    resp = json.load(urllib.urlopen(person_url))
    
    post_info = [m for m in resp['memberships'] if m['post']]

    for post in post_info:
        if post['organization']['id'] == org_id:
            if not post['end_date']:
                yield resp, post['post']

def load_geom(ward):
    geom_url = '{0}/boundaries/chicago-wards-2015/{1}/'.format(base_url,
                                                               ward.replace(' ', '-').lower())

    geom_resp = json.load(urllib.urlopen(geom_url))

    simple_url = '{0}/{1}'.format(base_url, geom_resp['related']['simple_shape_url'])
    
    simple_resp = json.load(urllib.urlopen(simple_url))

    return geom_resp['centroid'], simple_resp


if __name__ == "__main__":
    for ward in iter_members():
        ward_info = {'metadata': {}}
        for person, post in load_person(ward):
            ward_info['metadata']['alderman'] = person['name']
            ward_info['metadata']['ward'] = post['label']
            for contact in person['contact_details']:
                ward_info['metadata'][contact['type']] = contact['value']
            centroid, simple_shape = load_geom(post['label'])
            ward_info['centroid'] = centroid
            ward_info['simple_shape'] = simple_shape
            
            fname = '%s.json' % post['label'].replace(' ', '').lower()
            fpath = '%s/%s' % (out_path, fname)
            with open(fpath, 'wb') as f:
                print('saving %s' % fname)
                f.write(json.dumps(ward_info))
