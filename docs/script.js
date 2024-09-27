console.log("Script starting");

let svg;
const colors = ['#78BC61', '#F8DD8B', '#C0C781', '#D54F67', '#AF988C'];

const weekColors = {
    1: '#78BC61', 2: '#F8DD8B', 3: '#F8DD8B',
    4: '#F8DD8B', 5: '#C0C781', 6: '#C0C781',
    7: '#C0C781', 8: '#D54F67', 9: '#D54F67',
    10: '#AF988C', 11: '#AF988C', 12: '#AF988C'
};

let connections, nodes, radius;

const fixedPositions = [
    { x: 0.2, y: 0.2 },  // Week 1
    { x: 0.5, y: 0.15 },  // Week 2
    { x: 0.25, y: 0.4 },  // Week 3
    { x: 0.6, y: 0.5 },  // Week 4
    { x: 0.7, y: 0.25 },  // Week 5
    { x: 0.9, y: 0.2 },  // Week 6
    { x: 0.7, y: 0.6 },  // Week 7
    { x: 0.65, y: 0.8 },  // Week 8
    { x: 0.45, y: 0.6 },  // Week 9
    { x: 0.25, y: 0.65 },  // Week 10
    { x: 0.45, y: 0.85 },  // Week 11
    { x: 0.8, y: 0.9 }   // Week 12
];

function initializeGraph() {
    try {
        console.log("initializeGraph() called");

        const elements = {
            graph: document.getElementById('graph') || createElementIfMissing('graph'),
            sidebar: document.getElementById('sidebar') || createElementIfMissing('sidebar', 'side-panel'),
            initialPanel: document.getElementById('initial-panel') || createElementIfMissing('initial-panel', 'side-panel'),
            showIntroButton: document.getElementById('show-intro-button') || createElementIfMissing('show-intro-button', '', 'button', 'Help'),
            titleImageContainer: document.getElementById('title-image') || createElementIfMissing('title-image')
        };

        console.log("Elements initialized:", elements);

        const graphRect = elements.graph.getBoundingClientRect();
        const width = Math.max(graphRect.width, 100); // Ensure a minimum width
        const height = Math.max(graphRect.height, 100); // Ensure a minimum height

        console.log("Graph dimensions:", width, "x", height);

        // Clear any existing content in the graph container
        elements.graph.innerHTML = '';

        // Create SVG
        svg = d3.select("#graph").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height]);

        console.log("SVG created:", svg);

        // Create connections
        connections = [
            [1, 2], [2, 3], [4, 5], [5, 6], [7, 8], [9, 10], [10, 11]
        ];

        // Calculate positions for week nodes
        radius = 40; // Increase this value to make bubbles larger
        const padding = 70; // Increased padding to make room for the title

        // Create nodes with fixed positions
        nodes = fixedPositions.map((pos, i) => ({
            id: i,
            x: padding + pos.x * (width - padding * 2),
            y: padding + pos.y * (height - padding * 2)
        }));

        // Set initial state
        document.body.classList.remove('sidebar-closed');
        elements.initialPanel.style.transform = 'translateX(0)';
        elements.sidebar.style.transform = 'translateX(100%)';

        for (const [name, element] of Object.entries(elements)) {
            console.log(`${name} element:`, element);
        }

        // Function to create missing elements
        function createElementIfMissing(id, className = '', tag = 'div', text = '') {
            console.warn(`Creating missing element: ${id}`);
            const element = document.createElement(tag);
            element.id = id;
            if (className) element.className = className;
            if (text) element.textContent = text;
            document.body.appendChild(element);
            return element;
        }

        console.log("Initial panel element:", elements.initialPanel);
        console.log("Initial panel innerHTML before:", elements.initialPanel.innerHTML);

        // Always set the content of the initial panel
        elements.initialPanel.innerHTML = `
            <h2>Welcome to the Cybernetic Countercultures Intensive</h2>
            <p>This site hosts our course materials, session recordings, and other resources.</p>
            
            <h3>How to Navigate:</h3>
            <ul>
                <li>Click on any week bubble to view details about that week's content.</li>
                <li>The lines between bubbles connect weeks that are part of the same unit.</li>
                <li>Use this panel to get an overview of the course structure (to bring it back up, click the "Help" button).</li>
            </ul>
            <h3>Course Overview:</h3>
            <p>What if there were a road less taken in the history of cybernetics — one with profound implications for how we understand technology today?</p>
            <p>Alongside the well-known cybernetics of command and control, of informatics and machine intelligence, in the 1960s and 1970s a more organic cybernetic mode also arose, an ecological line of inquiry that foregrounded the complex internal and interactive behaviors of living systems.</p> 
            <p>A 12-week online course led by Dr. Bruno Clarke and Dr. David McConville of Gaian Systems, and co-produced by Gray Area, the Cybernetic Countercultures Intensive will take this alternative ecological route through the larger history of cybernetics. Our aim is to recover and revive the organic and ecological lines of systems thinking and then to venture toward new ways of conceiving and building advanced technological systems — from machines that work in symbiosis with living processes to adaptive architectures and regenerative infrastructures. Join us on a voyage of rediscovery seeking not to imitate life but to integrate the technosphere with the biosphere, to design a technological paradigm grounded in the sensitivity and sentience of the living world.</p>
            <h3>Info Session:</h3>
            <!-- YouTube Video Embed -->
            <div class="video-container">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/bqDfL8BVR_k?si=D9dV5S6bVkvHoQjf" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        `;

        console.log("Initial panel innerHTML after:", elements.initialPanel.innerHTML);

        // Ensure the initial panel is visible
        showInitialPanel();
        addCloseButton(elements.initialPanel, closeInitialPanel);

        // Function to show initial panel
        function showInitialPanel() {
            document.body.classList.add('intro-panel-open');
            document.getElementById('initial-panel').style.transform = 'translateX(0)';
            setTimeout(() => {
                drawConnections(connections, nodes, radius);
            }, 300); // Match this to your CSS transition time
        }

        // Add event listener to the show intro button
        elements.showIntroButton.addEventListener('click', showInitialPanel);

        // Function to close initial panel
        function closeInitialPanel() {
            document.body.classList.remove('intro-panel-open');
            document.getElementById('initial-panel').style.transform = 'translateX(100%)';
            setTimeout(() => {
                drawConnections(connections, nodes, radius);
            }, 300); // Match this to your CSS transition time
        }

        // Add close button to initial panel
        function addCloseButton(panel, closeFunction) {
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Hide';
            closeButton.className = 'panel-close-button'; // Add this line
            closeButton.onclick = closeFunction;
            panel.appendChild(closeButton);
        }

        // Insert title image
        if (!elements.titleImageContainer.querySelector('img')) {
            const img = document.createElement('img');
            img.src = './ccilogo.png'; // Update this path to match your image file location
            img.alt = 'Course Title';
            elements.titleImageContainer.appendChild(img);
            console.log("Logo added:", img);
        }

        console.log("SVG created and appended");

        // Draw connections
        function drawConnections(connections, nodes, radius) {
            console.log("Drawing connections");
            
            const graphElement = document.getElementById('graph');
            const isSidebarOpen = document.body.classList.contains('sidebar-open');
            const isIntroPanelOpen = document.body.classList.contains('intro-panel-open');
            const width = isSidebarOpen || isIntroPanelOpen ? graphElement.offsetWidth : window.innerWidth;
            const height = graphElement.offsetHeight;

            // Update SVG dimensions
            svg.attr("width", width)
               .attr("height", height)
               .attr("viewBox", [0, 0, width, height]);

            // Recalculate node positions
            nodes = fixedPositions.map((pos, i) => ({
                id: i,
                x: pos.x * width,
                y: pos.y * height
            }));

            // Clear existing elements
            svg.selectAll("*").remove();

            // Draw connections
            svg.selectAll("line")
                .data(connections)
                .enter()
                .append("line")
                .attr("x1", d => nodes[d[0]].x)
                .attr("y1", d => nodes[d[0]].y)
                .attr("x2", d => nodes[d[1]].x)
                .attr("y2", d => nodes[d[1]].y)
                .attr("stroke", "#ccc")
                .attr("stroke-width", 2);

            // Draw nodes
            const nodeGroups = svg.selectAll("g")
                .data(nodes)
                .enter()
                .append("g")
                .on("click", (event, d) => {
                    console.log(`Bubble clicked: Week ${d.id + 1}`);
                    showWeekContent(d.id + 1);
                });

            nodeGroups.append("circle")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", radius)
                .attr("fill", (d, i) => weekColors[i + 1] || '#CCCCCC'); // Default to gray if color not found

            nodeGroups.append("text")
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("fill", "white")
                .attr("class", "week-number")
                .text((d, i) => `Week ${i + 1}`);

            console.log("Connections drawn");
            console.log("initializeGraph() completed");
        }

        drawConnections(connections, nodes, radius);

        console.log("SVG in DOM:", document.querySelector('#graph svg'));

        console.log("Overlapping elements:", 
            Array.from(document.body.children)
            .filter(el => el.id !== 'graph' && 
                el.getBoundingClientRect().width === window.innerWidth && 
                el.getBoundingClientRect().height === window.innerHeight)
        );

        console.log("Main content display:", 
            window.getComputedStyle(document.getElementById('main-content')).display
        );

        console.log("SVG viewBox:", document.querySelector('#graph svg').getAttribute('viewBox'));

        function forceRedraw(element) {
            element.style.display = 'none';
            element.offsetHeight; // Trigger a reflow
            element.style.display = '';
        }

        forceRedraw(document.querySelector('#graph svg'));
    } catch (error) {
        console.error("Error in initializeGraph:", error);
    }
}


function showWeekContent(weekNumber) {
    console.log(`Showing content for week ${weekNumber}`);
    const sidebar = document.getElementById('sidebar');
    const initialPanel = document.getElementById('initial-panel');
    
    if (sidebar && initialPanel) {
        document.body.classList.add('sidebar-open');
        sidebar.style.transform = 'translateX(0)';
        initialPanel.style.transform = 'translateX(100%)'; // Hide initial panel
        
        const weekDetail = weekDetails.find(detail => detail.week === weekNumber);
        
        if (weekDetail) {
            let materialsHTML = '';
            let readingsHTML = '';
            let slidesHTML = '';
            let guestHTML = '';
            let linksHTML = '';
            // Only create the Suggested Readings section if there are materials
            if (weekDetail.materials && weekDetail.materials.length > 0) {
                materialsHTML = `
                    <h3>Suggested Readings:</h3>
                    <ul>
                        ${weekDetail.materials.map(material => 
                            `<li><a href="#" onclick="downloadFile('${material.filename}')">${material.name}</a></li>`
                        ).join('')}
                    </ul>
                `;
            }

            // Only create the Linked Readings section if there are links
            if (weekDetail.links && weekDetail.links.length > 0) {
                linksHTML = `
                    <h3>Suggested Readings:</h3>
                    <ul>
                        ${weekDetail.links.map(links => 
                            `<li><a href="${links.link}" target="_blank">${link.name}</a></li>`
                        ).join('')}
                    </ul>
                `;
            }

            // Only create the Additional Materials section if there are readings
            if (weekDetail.readings && weekDetail.readings.length > 0) {
                readingsHTML = `
                    <h3>Additional Materials:</h3>
                    <ul>
                        ${weekDetail.readings.map(reading => 
                            `<li><a href="#" onclick="downloadFile('${reading.filename}')">${reading.name}</a></li>`
                        ).join('')}
                    </ul>
                `;
            }

            // Only create the Slides section if there are slides
            if (weekDetail.slides && weekDetail.slides.length > 0) {
                slidesHTML = `
                    <h3>Lecture Slides:</h3>
                    <ul>
                        ${weekDetail.slides.map(slides => 
                            `<li><a href="#" onclick="downloadFile('${slides.filename}')">${slides.name}</a></li>`
                        ).join('')}
                    </ul>
                `;
            }

            // Only create the Guest section if there is a guest
            if (weekDetail.guest) {
                guestHTML = `
                    <h3>Guest: ${weekDetail.guest}</h3>
                `;
            }

            sidebar.innerHTML = `
                <button class="panel-close-button" onclick="closeSidebar()">&times;</button>
                <h2>Week ${weekNumber}: ${weekDetail.date}</h2>
                <h2>${weekDetail.title}</h2>
                ${guestHTML}
                <p>${weekDetail.description}</p>
                ${materialsHTML}
                ${linksHTML}
                ${readingsHTML}
                ${slidesHTML}
            `;
        } else {
            sidebar.innerHTML = `
                <button class="panel-close-button" onclick="closeSidebar()">&times;</button>
                <h2>Week ${weekNumber}</h2>
                <p>Content for this week is not available yet.</p>
            `;
        }
        
        setTimeout(() => {
            drawConnections(connections, nodes, radius);
        }, 300); // Match this to your CSS transition time
    } else {
        console.error('Sidebar or initial panel element not found');
    }
}

function closeSidebar() {
    document.body.classList.remove('sidebar-open');
    document.getElementById('sidebar').style.transform = 'translateX(100%)';
    setTimeout(() => {
        drawConnections(connections, nodes, radius);
    }, 300);
}

// Global variable to store week details
let weekDetails = [];

// Fetch the week details
fetch('weekDetails.json')
    .then(response => response.json())
    .then(data => {
        weekDetails = data;
        console.log('Week details loaded:', weekDetails);
    })
    .catch(error => console.error('Error loading week details:', error));

function downloadFile(filename) {
    window.open(`./course-files/${filename}`, '_blank');
}

// Make sure these functions are defined in the global scope
window.drawConnections = drawConnections;
window.closeSidebar = closeSidebar;
window.showWeekContent = showWeekContent;

// Call initializeGraph when the DOM is fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeGraph);
} else {
    initializeGraph();
}

window.addEventListener('resize', () => {
    drawConnections(connections, nodes, radius);
});
