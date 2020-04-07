profiles = {
    # Enable reads (GET), inserts (POST) and DELETE for resources/collections
    # (if you omit this line, the API will default to ['GET'] and provide
    # read-only access to the endpoint).
    'resource_methods': ['GET', 'POST', 'DELETE'],

    # Enable reads (GET), edits (PATCH), replacements (PUT) and deletes of
    # individual items  (defaults to read-only item access).
    'item_methods': ['GET', 'PATCH', 'PUT', 'DELETE'],

    'allow_unknown': True,

    'schema': {
        'name': {'type': 'string'},
    }, 

    # by default the standard item entry point is defined as
    # '/people/<ObjectId>'. We leave it untouched, and we also enable an
    # additional read-only entry point. This way consumers can also perform
    # GET requests at '/people/<name>'.
    'additional_lookup': {
        'url': 'regex("[\w]+")',
        'field': 'name'
    }
}

DOMAIN = {'profiles': profiles }