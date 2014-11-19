"""Definition of the Iss Event content type
"""

from zope.interface import implements

from Products.Archetypes import atapi
from Products.ATContentTypes.content import base
from Products.ATContentTypes.content import schemata
from Products.ATContentTypes.content import event

# -*- Message Factory Imported Here -*-

from Products.IssEvent.interfaces import IIssEvent
from Products.IssEvent.config import PROJECTNAME
from Products.ATExtensions import ateapi
from Products.ATExtensions.widget import *

IssEventSchema = event.ATEventSchema.copy() + atapi.Schema((

    atapi.StringField(
            name='eventroom',
            widget = ateapi.ComboWidget(
            label=u"Event Room",
            description=u"Please choose from the list or enter a room number",
        ),
        vocabulary=["220","1400","3711"]
    ),
    atapi.StringField(
        name='building',
        widget = ateapi.ComboWidget(
            label=u"Building Name",
            description=u"Choose the building for the event location",
        ),
        vocabulary=["SSH","Kerr","Mrak"]
     ),
    atapi.StringField(
            name='publicprivate',
            required=True,
            widget=atapi.SelectionWidget(
                label='Event Audience',
                description='Please Choose The Event Audience',
                format="radio",
            ),
            vocabulary=["Public","Private","Other"]
        ),
    atapi.StringField(
            name='eventtype',
            required=True,
            widget=atapi.SelectionWidget(
                label='Event Type',
                description='Please Choose The Event Type   ',
                format="radio",
            ),
            vocabulary=["ISS Event","ISS Co-Sponsored Event","UCD Community Event"]
        ),
))

# Set storage on fields copied from ATContentTypeSchema, making sure
# they work well with the python bridge properties.

IssEventSchema['title'].storage = atapi.AnnotationStorage()
IssEventSchema['description'].storage = atapi.AnnotationStorage()

schemata.finalizeATCTSchema(IssEventSchema, moveDiscussion=False)
# finalizeATCTSchema moves 'location' into 'categories', we move it back:
IssEventSchema.changeSchemataForField('location', 'default')
IssEventSchema.moveField('location', before='startDate')

class IssEvent(base.ATCTContent):
    """Event for ISS website"""
    implements(IIssEvent)

    meta_type = "IssEvent"
    schema = IssEventSchema

    title = atapi.ATFieldProperty('title')
    description = atapi.ATFieldProperty('description')

    # -*- Your ATSchema to Python Property Bridges Here ... -*-

atapi.registerType(IssEvent, PROJECTNAME)