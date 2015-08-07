React = require 'react'
{div, p, a, button, input, form, checked, label, h1, h2, br,span, i} = React.DOM

backend = require './backend.coffee'



module.exports = SideBar = React.createFactory React.createClass

    render: ->
        div id: "sidebar", className: 'sidebar',
            SearchPlaces
                searchdata: null
            SidebarHeading
                homedata: @props.homedata
            DbListing
                peacemarker: @props.peacemarker



SearchPlaces = React.createFactory React.createClass

    getInitialState: ->
        return searchdata: @props.searchdata

    render: ->
        div id: "sidebar-searchdata", className: 'sidebar-searchdata',

            Searchdata {}, 'text'



Searchdata = React.createFactory React.createClass

    render: ->
        div id: "sidebar-search", className: 'search',
        input {
            id: "sidebar-search-input", className: 'isearch',
            type: 'text', placeholder: 'search for address on map...'}



SidebarHeading = React.createFactory React.createClass

    render: ->
        console.log @props

        div id: "sidebar-heading", className: 'sidebar-heading',

            Homedata homedata: @props.homedata, 'text'



# Le composant qui va définir une ligne de homedata
Homedata = React.createFactory React.createClass

    getInitialState: ->
        return {

            helloworld: @props.homedata.helloworld
            username: @props.homedata.username
            show_pin_point: @props.homedata.show_pin_point
            kilometres: @props.homedata.kilometres
            miles: @props.homedata.miles
            celsius: @props.homedata.celsius
            fahrenheit: @props.homedata.fahrenheit
            hectare: @props.homedata.hectare
            acre: @props.homedata.acre
        }

    onOkClicked: ->

        username = @refs.usernameInput.getDOMNode().value
        show_pin_point = @refs.show_pin_pointInput.getDOMNode().value
        kilometres = @refs.kilometresInput.getDOMNode().value
        miles = @refs.milesInput.getDOMNode().value
        celsius = @refs.celsiusInput.getDOMNode().value
        fahrenheit = @refs.fahrenheit.getDOMNode().value
        hectare = @refs.hectare.getDOMNode().value
        acre = @refs.acre.getDOMNode().value

        homedata =
            id: @props.homedata.id
            username: username
            show_pin_point: show_pin_point
            kilometres: kilometres
            miles: miles
            celsius: celsius
            fahrenheit: fahrenheit
            hectare: hectare
            acre: acre



        backend.putConfigid homedata, ->
            console.log "data saved"
            # http://facebook.github.io/react/docs/forms.html



    render: ->
        div id: 'sidebar-home', className: 'heading',
            p {className: 'hello'},
                "#{@state.helloworld} #{@state.username}"
                div id: 'sidebar-home-view', className: 'view-title',
                    # icon Db
                    p { className: 'dbpanel'},
                        a href: "#config", className: "userconfig"
                        " "
                        a href: "#", className: "placesdata"


                # Modal config for homedata
                a href: "#close", className: "overlay", id: "config"
                div className: "popup",
                    "Update your Preferences here"
                    br null, null
                    "change username: "
                    input {
                        ref: "usernameInput"
                        type: "String"
                        defaultValue: "#{@state.username}"}

                    br null, null
                    br null, null

                    "Show 'Home View' marker: "
                    "(drag the marker to edit)"

                    input {
                        ref: "show_pin_pointInput"
                        type: 'checkbox'
                        defaultChecked: "#{@state.show_pin_point}"
                        initialChecked: "#{@state.show_pin_point}"}

                    br null, null
                    br null, null

                    "Units: "
                    "Distance "
                    form

                    input {
                        ref: "kilometresInput"
                        type: "radio"
                        name: "distance"
                        value: "kilometres"}, "Kilometres"

                    input {
                        ref: "milesInput"
                        type: "radio"
                        name: "distance"
                        value: "miles"}, "Miles"

                    br null, null

                    "Units: "
                    "Temperature "
                    form

                    input {
                        ref: "celsiusInput"
                        type: "radio"
                        name: "temperature"
                        value: "celsius"}, "Celsius"

                    input {
                        ref: "fahrenheitInput"
                        type: "radio"
                        name: "temperature"
                        value: "fahrenheit"}, "Fahrenheit"

                    br null, null

                    "Units: "
                    "Aera "
                    form

                    input {
                        ref: "hectareInput"
                        type: "radio"
                        name: "aera"
                        value: "hectare"}, "Hectare"

                    input {
                        ref: "acreInput"
                        type: "radio"
                        name: "aera"
                        value: "acre"}, "Acres"

                    br null, null
                    br null, null

                    input
                        type: "submit"
                        value: "Save"
                        onClick: @onOkClicked

                    a href: "#close", className: "close"



DbListing = React.createFactory React.createClass

    render: ->
        console.log @props

        div id: "bookmark-list", className: 'listings',

            Peacemarker peacemarker: @props.peacemarker, 'text'

#
#     getInitialState: ->
#         return placesdata: @props.placesdata
#         #@getPlacesBookmarkComponents()
#
#
#
#     # Cette fonction renvoie à la liste places bookmark qu'on veut générer.
#     getPlacesBookmarkComponents: ->
#         placesbookmarkComponents = []
#         for placesdata in @state.placesdata
#             placesbookmarkComponents = PlacesBookmarkComponent
#                 pcoordinates: placesdata.features[0].geometry.coordinates
#                 plng: placesdata.features[0].geometry.coordinates[0]
#                 plat: placesdata.features[0].geometry.coordinates[1]
#                 pzoom: placesdata.features[0].properties.zoom
#                 ptitle: placesdata.features[0].properties.title
#                 paddress: placesdata.features[0].properties.address
#                 ppostalCode: placesdata.features[0].properties.postalCode
#                 pcity: placesdata.features[0].properties.city
#                 pstate: placesdata.features[0].properties.state
#                 pcountry: placesdata.features[0].properties.country
#                 pphone: placesdata.features[0].properties.phone
#                 pemail: placesdata.features[0].properties.email
#                 pwebsite: placesdata.features[0].properties.website
#                 ptag: placesdata.features[0].properties.tag
#             placesdatabookmarkComponents.push placesdatabookmarkComponent
#             return placesdatabookmarkComponents
#
#     render: ->
#
#         div id: "bookmark-list", className: 'listings',
#
#             # Placesdata {}, 'text'
#
#
#
Peacemarker = React.createFactory React.createClass

    # getInitialState: ->
    #     return {
    #         title: @props.peacemarker.title
    #         lat: @props.peacemarker.lat
    #         lng: @props.peacemarker.lng
    #         zoom: @props.peacemarker.zoom
    #         address: @props.peacemarker.address
    #         postalcode: @props.peacemarker.postalcode
    #         city: @props.peacemarker.city
    #         state: @props.peacemarker.state
    #         country: @props.peacemarker.country
    #         phone: @props.peacemarker.phone
    #         email: @props.peacemarker.email
    #         website: @props.peacemarker.website
    #     }

    render: -> null
        # div id: 'sidebar-places',
        #     div id: 'sidebar-places-item', className: 'item',
        #         p {className: "title"},
        #             "#{@state.title}"
        #             br null, null
        #         span {className: "mygps"},
        #             "Lat: #{@state.lat} Lng: #{@state.lng}"
        #             br null, null
        #         span className: 'irl',
        #             "#{@state.address} "
        #             "#{@state.postalCode} "
        #             "#{@state.city}, "
        #             "#{@state.state} "
        #             "#{@state.zip} "
        #             "#{@state.country}"
        #
        #             div id: 'infow',
        #         p {className: 'kontact'},
        #             # coffeelint: disable=max_line_length
        #             a href: @state.website, target: '_blank', @state.website + ' '
        #             a href: "mailto:@state.email", target: '_top', @state.email + ' '
        #             a href: "callto:@state.phone", target: '_top', @state.phone
        #             # coffeelint: enable=max_line_length
