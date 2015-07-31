React = require 'react'
{div, p, a, button, input, form, checked, label, h1, h2, br,span, i} = React.DOM



module.exports = SideBar = React.createFactory React.createClass

    render: ->
        div id: "sidebar", className: 'sidebar',
            SearchPlaces
                searchdata: null
            SidebarHeading
                homedata: @props.homedata


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
        console.log 'SidebarHeading'
        console.log @props

        div id: "sidebar-heading", className: 'sidebar-heading',

            Homedata homedata: @props.homedata, 'text'



# Le composant qui va définir une ligne de homedata
Homedata = React.createFactory React.createClass

    #test
    getInitialState: ->
        console.log @props.userConfig
        return {
            helloworld: @props.homedata.helloworld
            username: @props.homedata.username
            title: @props.homedata.title
            lat: 39.4568257456
            lng: 0.500042567
            zoom: 3
        }

    onOkClicked: ->
        configuration = @state.homedata
        username = @refs.usernameInput.getDOMNode().value

        homedata = username: username
        sidebarHeading.push userConfig.getConfig

        # Changement d'état.
        @setState homedata: homedata
        # Requête au server.
        data.putConfigid homedata.username, ->


    render: ->
        div id: 'sidebar-home', className: 'heading',
            p {className: 'hello'},
                "#{@state.helloworld} #{@state.username}"
                div id: 'sidebar-home-view', className: 'view-title',
                    p {className: "title"},
                        a href: "#config", className: "config", id: "cfg"
                        "Preferences "
                        br null, null
                    p {className: 'view-coords'},
                        "#{@state.title} : "
                        "Lat: #{@state.lat.toFixed(4)} "
                        "Lng: #{@state.lng.toFixed(4)} "
                        "zoom: #{@state.zoom}"
                    p { className: 'dbpanel'},
                        a href: "#", className: "placesdata"


                # Modal config for homedata
                a href: "#close", className: "overlay", id: "config"
                div className: "popup",
                    "Update your Preferences here"
                    br null, null
                    "change username: "
                    input {
                        ref: "usernameInput"
                        type: "text"
                        value: "#{@state.username}"}
                    button
                        onClick: @onOkClicked
                    , "ok"



                    br null, null
                    br null, null
                    "view finder is:"
                    br null, null
                    "Lat, Lng: "

                    input {
                        id: "vflatlng"
                        type: 'text',
                        placeholder: "#{@state.lat}, #{@state.lng}"}

                    br null, null
                    "zomm: "

                    input {
                        id: "vfzoom",
                        type: 'text',
                        placeholder: "#{@state.zoom}"}

                    br null, null
                    br null, null
                    "Show 'view finder' marker: "

                    input {
                        id: "showmarker",
                        type: 'checkbox',
                        name: "true", value: "true"}

                    br null, null
                    br null, null
                    input {type: "submit", value: "Submit"}
                    # br null, null
                    # br null, null
                    # "Units"
                    # br null, null
                    # "Distance"
                    # br form
                    #
                    # input {
                    #     type: "radio",
                    #     name: "distance",
                    #     value: "kilometres"}, "Kilometres"
                    #
                    # br null, null
                    #
                    # input {
                    #     type: "radio",
                    #     name: "distance", value: "miles"}, "Miles"
                    #
                    # br null, null
                    # "Temperature"
                    # br form
                    #
                    # input {
                    #     type: "radio",
                    #     name: "temperature",
                    #     value: "celsius"}, "Celsius"
                    #
                    # br null, null
                    #
                    # input {
                    #     type: "radio",
                    #     name: "temperature", value: "fahrenheit"}, "Fahrenheit"
                    #
                    # br null, null
                    # "Aera"
                    # br form
                    #
                    # input {
                    #     type: "radio",
                    #     name: "aera",
                    #     value: "hectare"}, "Hectare"
                    #
                    # br null, null
                    #
                    # input {
                    #     type: "radio",
                    #     name: "aera", value: "acre"}, "Acres"
                    #
                    # br null, null
                    # br null, null
                    # input {type: "submit", value: "Submit"}
                    a href: "#close", className: "close"



# DbListing = React.createFactory React.createClass
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
# # Le composant qui va définir une ligne de placesdata.
# Placesdata = React.createFactory React.createClass
#
#     render: ->
#         div id: 'sidebar-places',
#             div id: 'sidebar-places-item', className: 'item',
#                 p {className: "title"},
#                     "#{@state.title}"
#                     br null, null
#                 span {className: "mygps"},
#                     "Lat: #{@state.ilat} Lng: #{@state.ilng}"
#                     br null, null
#                 span className: 'irl',
#                     "#{@state.address} "
#                     "#{@state.postalCode} "
#                     "#{@state.city}, "
#                     "#{@state.state} "
#                     "#{@state.zip} "
#                     "#{@state.country}"
#
#                     div id: 'infow',
#                 p {className: 'kontact'},
#                 # coffeelint: disable=max_line_length
#                     a href: @state.website, target: '_blank', @state.website + ' '
#                     a href: "mailto:@state.email", target: '_top', @state.email + ' '
#                     a href: "callto:@state.phone", target: '_top', @state.phone
#                     # coffeelint: enable=max_line_length
#                 span {className: 'tag'},
#                     "TAG: #{@state.tag}"
