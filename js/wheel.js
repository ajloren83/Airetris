document.addEventListener("DOMContentLoaded", function() {
    const svg = document.getElementById('wheelSvg');
    if (!svg) return;

    const cx = 500;
    const cy = 500;
    const innerRadius = 180;
    const middleRadius = 320;
    const outerRadius = 460;

    // Data Structure
    const quadrants = [
        {
            name: "Research & Evidence",
            color: "#e85d38",
            textColor: "#000",
            startAngle: 270,
            endAngle: 360,
            children: [
                { name: "Building A Culture Of Trust Research", desc: "Foundational research metrics into the effects of building high-trust organizations." },
                { name: "Psychological Safety Research", desc: "Insights demonstrating the impact of psychological safety on team execution and risk reporting." },
                { name: "Ethical Culture & Improved Profitability", desc: "Data linking ethical frameworks to long-term talent retention and innovation." },
                { name: "Corporate Governance Linkage & Research", desc: "Understanding how effective governance directly correlates to improved market stability." },
                { name: "Moral Courage Linkage To Whistleblowing", desc: "Analysis of the conditions necessary for employees to safely blow the whistle." }
            ]
        },
        {
            name: "Practice & Cases",
            color: "#e22153",
            textColor: "#fff",
            startAngle: 0,
            endAngle: 90,
            children: [
                { name: "IPO/Transactions", desc: "Preparing companies to navigate high-stakes compliance environments prior to public offerings." },
                { name: "M&A Transactions", desc: "Conducting rigorous ethical and compliance due diligence in mergers and acquisitions." },
                { name: "Audits", desc: "Evaluating institutional frameworks and internal controls for gaps and vulnerabilities." },
                { name: "Investigations", desc: "Leading internal investigations related to corporate misconduct, ethics breaches, and fraud." },
                { name: "Lawsuits", desc: "Utilizing past litigation and enforcement actions as a basis for preventing future risks." }
            ]
        },
        {
            name: "Global Standards & Rules",
            color: "#e065cd",
            textColor: "#000",
            startAngle: 90,
            endAngle: 180,
            children: [
                { name: "Anti Corruption (EU/US/Global)", desc: "Adherence to the FCPA, UK Bribery Act, and other anti-corruption legislations globally." },
                { name: "Data Protection & Cybersecurity", desc: "Frameworks designed to robustly protect customer data against emerging threat vectors." },
                { name: "Sanctions & Exports Controls", desc: "Ensuring operations do not violate international economic sanctions or trade controls." },
                { name: "Sustainability / Climate Governance", desc: "ESG readiness and the incoming wave of EU sustainability due diligence mandates." },
                { name: "AI Governance", desc: "Scaling autonomous systems governance and ethical frameworks for emerging technologies." }
            ]
        },
        {
            name: "Psychology & Neuroscience",
            color: "#ffd633",
            textColor: "#000",
            startAngle: 180,
            endAngle: 270,
            children: [
                { name: "Normative Influence on Violations", desc: "How social norms and peer behavior inherently influence ethical and unethical decisions." },
                { name: "Behavioral Design", desc: "Designing systems that naturally guide employees towards compliant, ethical actions." },
                { name: "Social Proof", desc: "Leveraging the psychology of human observation to model desired organizational accountability." },
                { name: "Blind Spots", desc: "Identifying systemic biases where executive teams fail to correctly interpret ethical failures." },
                { name: "Incentives", desc: "Realigning performance incentives to promote sustainable growth instead of reckless risk-taking." }
            ]
        }
    ];

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, innerRadius, outerRadius, startAngle, endAngle) {
        const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
        const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
        const startInner = polarToCartesian(x, y, innerRadius, endAngle);
        const endInner = polarToCartesian(x, y, innerRadius, startAngle);

        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        const d = [
            "M", startOuter.x, startOuter.y,
            "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
            "L", endInner.x, endInner.y,
            "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
            "Z"
        ].join(" ");

        return d;
    }

    function createTextPath(text, x, y, radius, angle, maxLineLength, className) {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "text");
        if (className) {
            group.setAttribute("class", "wedge-text " + className);
        } else {
            group.setAttribute("class", "wedge-text");
        }
        group.setAttribute("transform", `translate(${x}, ${y}) rotate(${angle})`);

        const words = text.split(" ");
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            if (currentLine.length + words[i].length + 1 <= maxLineLength) {
                currentLine += " " + words[i];
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);

        const lineHeight = 17;
        const startY = radius - ((lines.length * lineHeight) / 2) + (lineHeight / 2);

        lines.forEach((line, index) => {
            const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            tspan.setAttribute("x", "0");
            tspan.setAttribute("y", startY + (index * lineHeight));
            tspan.textContent = line;
            group.appendChild(tspan);
        });

        return group;
    }

    quadrants.forEach(q => {
        const midArc = document.createElementNS("http://www.w3.org/2000/svg", "path");
        midArc.setAttribute("d", describeArc(cx, cy, innerRadius, middleRadius, q.startAngle, q.endAngle));
        midArc.setAttribute("fill", q.color);
        midArc.setAttribute("class", "wedge wedge-middle");
        midArc.dataset.title = q.name;
        midArc.dataset.desc = "Core pillar of the Areté Operating System.";
        svg.appendChild(midArc);

        const midAngle = q.startAngle + (q.endAngle - q.startAngle) / 2;
        const midRadiusCenter = innerRadius + (middleRadius - innerRadius) / 2;
        const posMid = polarToCartesian(cx, cy, midRadiusCenter, midAngle);

        let rotMid = midAngle;
        if (rotMid > 90 && rotMid < 270) rotMid += 180;

        svg.appendChild(createTextPath(q.name, posMid.x, posMid.y, 0, rotMid, 15, q.textColor === '#fff' ? 'wedge-text-white' : ''));

        const step = (q.endAngle - q.startAngle) / q.children.length;
        q.children.forEach((child, i) => {
            const start = q.startAngle + (step * i);
            const end = start + step;

            const outerColor = q.color;

            const outArc = document.createElementNS("http://www.w3.org/2000/svg", "path");
            outArc.setAttribute("d", describeArc(cx, cy, middleRadius, outerRadius, start, end));
            outArc.setAttribute("fill", outerColor);
            outArc.setAttribute("class", "wedge wedge-outer");
            outArc.dataset.title = child.name;
            outArc.dataset.desc = child.desc;
            svg.appendChild(outArc);

            const outAngle = start + (step / 2);
            const outRadiusCenter = middleRadius + (outerRadius - middleRadius) / 2;
            const posOut = polarToCartesian(cx, cy, outRadiusCenter, outAngle);

            let rotOut = outAngle;
            if (rotOut > 90 && rotOut < 270) rotOut += 180;

            svg.appendChild(createTextPath(child.name, posOut.x, posOut.y, 0, rotOut, 15, q.textColor === '#fff' ? 'wedge-text-white' : ''));
        });
    });

    const ptCenter = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ptCenter.setAttribute("cx", cx);
    ptCenter.setAttribute("cy", cy);
    ptCenter.setAttribute("r", innerRadius);
    ptCenter.setAttribute("class", "center-circle");
    svg.appendChild(ptCenter);

    const textCenter1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textCenter1.setAttribute("x", cx);
    textCenter1.setAttribute("y", cy - 10);
    textCenter1.setAttribute("class", "center-title");
    textCenter1.textContent = "Areté";
    svg.appendChild(textCenter1);

    const textCenter2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textCenter2.setAttribute("x", cx);
    textCenter2.setAttribute("y", cy + 40);
    textCenter2.setAttribute("class", "center-subtitle");
    textCenter2.textContent = "Our Ethical";
    svg.appendChild(textCenter2);

    const textCenter3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textCenter3.setAttribute("x", cx);
    textCenter3.setAttribute("y", cy + 65);
    textCenter3.setAttribute("class", "center-subtitle");
    textCenter3.textContent = "Operating System";
    svg.appendChild(textCenter3);

    function addOrbitArrow(text, radius, startAngle, endAngle, gapStart, gapEnd, reverse = false) {
        const pt1 = polarToCartesian(cx, cy, radius, startAngle);
        const pt2 = polarToCartesian(cx, cy, radius, gapStart);
        const tailPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        tailPath.setAttribute("fill", "none");
        tailPath.setAttribute("stroke", "#6e737c");
        tailPath.setAttribute("stroke-width", "3");
        tailPath.setAttribute("d", `M ${pt1.x} ${pt1.y} A ${radius} ${radius} 0 0 1 ${pt2.x} ${pt2.y}`);
        svg.appendChild(tailPath);

        const pt3 = polarToCartesian(cx, cy, radius, gapEnd);
        const pt4 = polarToCartesian(cx, cy, radius, endAngle);
        const headPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        headPath.setAttribute("fill", "none");
        headPath.setAttribute("stroke", "#6e737c");
        headPath.setAttribute("stroke-width", "3");
        headPath.setAttribute("marker-end", "url(#arrowhead)");
        headPath.setAttribute("d", `M ${pt3.x} ${pt3.y} A ${radius} ${radius} 0 0 1 ${pt4.x} ${pt4.y}`);
        svg.appendChild(headPath);

        const textPathId = 'tpath-' + text.replace(/\s+/g, '');
        const txtPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        txtPath.setAttribute("id", textPathId);
        txtPath.setAttribute("fill", "none");

        let textRadius = radius;
        if (reverse) textRadius = radius + 9;

        const tStart = polarToCartesian(cx, cy, textRadius, startAngle);
        const tEnd = polarToCartesian(cx, cy, textRadius, endAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        if (reverse) {
            txtPath.setAttribute("d", `M ${tEnd.x} ${tEnd.y} A ${textRadius} ${textRadius} 0 ${largeArcFlag} 0 ${tStart.x} ${tStart.y}`);
        } else {
            txtPath.setAttribute("d", `M ${tStart.x} ${tStart.y} A ${textRadius} ${textRadius} 0 ${largeArcFlag} 1 ${tEnd.x} ${tEnd.y}`);
        }
        svg.appendChild(txtPath);

        const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textEl.setAttribute("class", "orbit-text");
        textEl.setAttribute("dy", "5");
        const textPathEl = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
        textPathEl.setAttribute("href", "#" + textPathId);
        textPathEl.setAttribute("startOffset", "50%");
        textPathEl.textContent = text;
        textEl.appendChild(textPathEl);

        svg.appendChild(textEl);
    }

    addOrbitArrow("GOVERNANCE", 480, 272, 358, 298, 332, false);
    addOrbitArrow("MONITORING", 480, 2, 88, 26, 64, false);
    addOrbitArrow("IMPLEMENTATION", 480, 95, 265, 145, 215, true);

    const tooltip = document.getElementById('tooltip');
    const tooltipTitle = document.getElementById('tooltipTitle');
    const tooltipDesc = document.getElementById('tooltipDesc');
    const container = document.querySelector('.wheel-container');

    document.querySelectorAll('.wedge').forEach(slice => {
        slice.addEventListener('mouseenter', function (e) {
            const title = this.dataset.title;
            const desc = this.dataset.desc;

            tooltipTitle.textContent = title;
            tooltipDesc.textContent = desc;
            tooltip.classList.add('show');
        });

        slice.addEventListener('mousemove', function (e) {
            const rect = container.getBoundingClientRect();
            let x = e.clientX - rect.left + 15;
            let y = e.clientY - rect.top + 15;

            if (x + 250 > rect.width) {
                x = e.clientX - rect.left - 265;
            }

            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
        });

        slice.addEventListener('mouseleave', function () {
            tooltip.classList.remove('show');
        });
    });
});
