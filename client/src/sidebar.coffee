React = require 'react'
{div, p, a, button, input, form, checked, label, h1, h2, br,span, i} = React.DOM



module.exports = SideBar = React.createFactory React.createClass

    render: ->
        div id: "sidebar", className: 'sidebar',
            div id: "sidebar-search", className: 'search',
            input {
                id: "sidebar-search-input", className: 'isearch',
                type: 'text', placeholder: 'search for address on map...'}
            SidebarHeading
                homedata: @props.homedata
            BookmarkList
                placesdata: @props.placesdata



SearchPlaces = React.createFactory React.createClass

    getInitialState: ->
        return {}

    render: ->
        return



SidebarHeading = React.createFactory React.createClass

    getInitialState: ->
        return homedata: @props.homedata

    render: ->

        div id: "sidebar-heading", className: 'sidebar-heading',

            Homedata {}, 'text'



# Le composant qui va définir une ligne de homedata.
Homedata = React.createFactory React.createClass

    getInitialState: ->
        return {
          # No Mod here
            helloworld: "Hello!"
            cfgPage: "#config"
            name: "Cozy User" #grab the name of the cozy user
            title: "view finder"
            placesdata_db: true
          # Mod OK here
            coordinates: [39.4568257456, 0.500042567]
            lat: 39.4568257456
            lng: 0.500042567
            zoom: 3
            show_pin_point: true
            kilometres: true
            miles: false
            celsius: true
            fahrenheit: false
        }

    render: ->
        div id: 'sidebar-home', className: 'heading',
            p {className: 'hello'},
                "#{@state.helloworld} #{@state.name}"
                div id: 'sidebar-home-view', className: 'view-title',
                    p {className: "title"},
                        a href: @state.cfgPage, className: "config", id: "cfg"
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
                    br null, null
                    "view finder is:"
                    br null, null
                    "Lat, Lng: "

                    input {
                        id: "vflatlng"
                        type: 'text',
                        placeholder: "#{@state.hlat}, #{@state.hlng}"}

                    br null, null
                    "zomm: "

                    input {
                        id: "vfzoom",
                        type: 'text',
                        placeholder: "#{@state.hzoom}"}

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
                    br null, null
                    br null, null
                    "Units"
                    br null, null
                    "Distance"
                    br form

                    input {
                        type: "radio",
                        name: "distance",
                        value: "kilometres"}, "Kilometres"

                    br null, null

                    input {
                        type: "radio",
                        name: "distance", value: "miles"}, "Miles"

                    br null, null
                    "Temperature"
                    br form

                    input {
                        type: "radio",
                        name: "temperature",
                        value: "celsius"}, "Celsius"

                    br null, null

                    input {
                        type: "radio",
                        name: "temperature", value: "fahrenheit"}, "Fahrenheit"

                    br null, null
                    "Aera"
                    br form

                    input {
                        type: "radio",
                        name: "aera",
                        value: "hectare"}, "Hectare"

                    br null, null

                    input {
                        type: "radio",
                        name: "aera", value: "acre"}, "Acres"

                    br null, null
                    br null, null
                    input {type: "submit", value: "Submit"}
                    a href: "#close", className: "close"



# Le composant liste de bookmark.
BookmarkList = React.createFactory React.createClass

    getInitialState: ->
        return {
            #homedata: @props.homedata
            placesdata: @props.placesdata
        }
        #@getHomeBookmarkComponents()
        #@getPlacesBookmarkComponents()



    # Cette fonction renvoie à la liste places bookmark qu'on veut générer.
    getPlacesBookmarkComponents: ->
        placesbookmarkComponents = []
        for placesdata in @state.placesdata
            placesbookmarkComponents = PlacesBookmarkComponent
                pcoordinates: placesdata.features[0].geometry.coordinates
                plng: placesdata.features[0].geometry.coordinates[0]
                plat: placesdata.features[0].geometry.coordinates[1]
                pzoom: placesdata.features[0].properties.zoom
                ptitle: placesdata.features[0].properties.title
                paddress: placesdata.features[0].properties.address
                ppostalCode: placesdata.features[0].properties.postalCode
                pcity: placesdata.features[0].properties.city
                pstate: placesdata.features[0].properties.state
                pcountry: placesdata.features[0].properties.country
                pphone: placesdata.features[0].properties.phone
                pemail: placesdata.features[0].properties.email
                pwebsite: placesdata.features[0].properties.website
                ptag: placesdata.features[0].properties.tag
            placesdatabookmarkComponents.push placesdatabookmarkComponent
            return placesdatabookmarkComponents

    render: ->

        div id: "bookmark-list", className: 'listings',

            # Homedata {}, 'text'
            # Placesdata {}, 'text'



# Le composant qui va définir une ligne de placesdata.
Placesdata = React.createFactory React.createClass

    render: ->
        div id: 'sidebar-places',
            div id: 'sidebar-places-item', className: 'item',
                p {className: "title"},
                    "#{@state.title}"
                    br null, null
                span {className: "mygps"},
                    "Lat: #{@state.ilat} Lng: #{@state.ilng}"
                    br null, null
                span className: 'irl',
                    "#{@state.address} "
                    "#{@state.postalCode} "
                    "#{@state.city}, "
                    "#{@state.state} "
                    "#{@state.zip} "
                    "#{@state.country}"

                    div id: 'infow',
                p {className: 'kontact'},
                # coffeelint: disable=max_line_length
                    a href: @state.website, target: '_blank', @state.website + ' '
                    a href: "mailto:@state.email", target: '_top', @state.email + ' '
                    a href: "callto:@state.phone", target: '_top', @state.phone
                    # coffeelint: enable=max_line_length
                span {className: 'tag'},
                    "TAG: #{@state.tag}"
