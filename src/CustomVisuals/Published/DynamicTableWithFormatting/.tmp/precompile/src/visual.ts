/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
module powerbi.extensibility.visual.gridC349787CD62C42098B77589D910C0721Z  {
    'use strict';

    import ValueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
    import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;
    import textMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;
    import TextProperties = powerbi.extensibility.utils.formatting.TextProperties;
    import AxisHelper = powerbi.extensibility.utils.chart.axis;
    const dataView: DataView = null;
    let valFormatter: IValueFormatter;
    let targetcolumnName: string = '';

    interface IGridColumnMapping {
        queryName: string;
        displayName: string;
        formatter: IValueFormatter;
        isMeasure: boolean;
        hasKPI: boolean;
        isKPIMeasure: boolean;
        idKPI: number;
    }

    interface IGridViewModel {
        settings: VisualSettings;
        columns: IGridColumnMapping[];
        invisibleColumns: IGridColumnMapping[];
    }

    interface IColumnIndex {
        columnName: string;
        index: number;
    }

    interface ITargetColumns {
        targetColumnName: string;
    }

    const targetColumns: ITargetColumns[] = [];
    let cloumnIndex: IColumnIndex[] = [];
    let columnIndexInvisibleColumn: IColumnIndex[] = [];

    let gridSettings: VisualSettings = null;

    function getValue<T>(objects: DataViewObjects, objectName: string, propertyName: string, defaultValue: T): T {

        if (objects) {
            const object: DataViewObject = objects[objectName];
            if (object) {
                const property: T = <T>object[propertyName];
                if (property !== undefined) {
                    return property;
                }
            }
        }

        return defaultValue;
    }
    function VisualTransform(options: VisualUpdateOptions, host: IVisualHost): IGridViewModel {
        const dataViews: DataView[] = options.dataViews;
        gridSettings = ParseSettings(options && options.dataViews && options.dataViews[0]);
        const columnMappings: IGridColumnMapping[] = [];
        const invisibleColumns: IGridColumnMapping[] = [];

        // tslint:disable-next-line:typedef
        dataViews[0].table.columns.forEach((element, index: number) => {
            // get the measure(Used when user enables hierarchy)
            const gridColumnMapping: IGridColumnMapping = {
                queryName: element.queryName,
                displayName: element.displayName,
                formatter: ValueFormatter.create({ format: element.format }),
                // tslint:disable-next-line:no-string-literal
                isMeasure: element.roles['measureData'] || false,
                hasKPI: false,
                isKPIMeasure: false,
                idKPI: 0
            };
            if (gridSettings.gridSettings.showHierarchy && !gridColumnMapping.isKPIMeasure && !gridColumnMapping.isMeasure) {
                columnMappings[element.sortOrder] = gridColumnMapping;
            } else if (!gridSettings.gridSettings.showHierarchy) {
                columnMappings.push(gridColumnMapping);
            }
            // tslint:disable-next-line:no-string-literal
            if (element.roles['invisibleColumns']) {
                invisibleColumns.push(gridColumnMapping);
            }
        });

        const categoryLen: number = columnMappings.length;

        return {
            settings: gridSettings,
            columns: columnMappings,
            invisibleColumns: invisibleColumns
        };
    }

    function ParseSettings(parseSettingsDataView: DataView): VisualSettings {
        return VisualSettings.parse(parseSettingsDataView) as VisualSettings;
    }

    export class Visual implements IVisual {
        private target: HTMLElement;
        private settings: VisualSettings;
        private host: IVisualHost;
        private loadingSymbol: d3.Selection<HTMLDivElement>;
        private grid: d3.Selection<HTMLDivElement>;
        private gridCont: d3.Selection<HTMLDivElement>;
        private header: d3.Selection<HTMLDivElement>;
        private body: d3.Selection<HTMLDivElement>;
        private footer: d3.Selection<HTMLDivElement>;
        private sortColumn: String;
        private gridRows: d3.selection.Update<DataViewTableRow>;
        private selectionManager: ISelectionManager;
        private gridModel: IGridViewModel;
        private persistSortSettings: PersistSortSettings;
        private persistResizeSettings: PersistResizeSettings;
        private persistExpandCollapseSettings: PersistExpandCollapseSettings;
        private columnWidths: string[] = [];
        private expandCollapseStates: string[] = [];
        private firedResize: boolean = false;
        // tslint:disable-next-line:no-any
        private static columnheaderdataViews: any;
        private static backgroundSelector: string;

        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.target = options.element;
            this.selectionManager = options.host.createSelectionManager();
            this.loadingSymbol = d3.select(this.target)
                .append('div')
                .classed('loading', true);
            this.gridCont = d3.select(this.target)
                .append('div')
                .classed('gridContainer', true);
            this.grid = this.gridCont.append('div')
                .classed('MAQGrid', true);
            this.header = this.grid.append('div')
                .classed('gridHeader', true);
            this.body = this.grid.append('div')
                .classed('gridBody', true);
            this.footer = this.grid.append('div')
                .classed('gridFooter', true);
            // this.loadingSymbol.append('div')
            //     .classed('annotationLoading', true);
        }

        public returnDisplayValue(valueLength: number): number {
            if (valueLength > 9) {
                return 1e9;
            } else if (valueLength <= 9 && valueLength > 6) {
                return 1e6;
            } else if (valueLength <= 6 && valueLength >= 4) {
                return 1e3;
            } else {
                return 10;
            }

        }
        // tslint:disable-next-line:typedef
        public update(options: VisualUpdateOptions) {
            this.gridModel = VisualTransform(options, this.host);
            let updateDataView: DataView;
            updateDataView = options.dataViews[0];
            Visual.columnheaderdataViews = updateDataView;
            let i: number = 0;
            for (let headCounter: number = 0; headCounter < Visual.columnheaderdataViews.table.columns.length; headCounter++) {
                if (Visual.columnheaderdataViews.table.columns[headCounter].roles.invisibleColumns !== true) {
                    const columnName: string = `sourceColumn${(i + 1).toString()}`;
                    this.gridModel.settings.color[columnName] = Visual.columnheaderdataViews.table.columns[headCounter].displayName;
                    i++;
                }
            }
            this.persistSortSettings = this.gridModel.settings.persistSortSettings;
            this.persistResizeSettings = this.gridModel.settings.persistResizeSettings;
            this.persistExpandCollapseSettings = this.gridModel.settings.persistExpandCollapseSettings;
            const columnMappings: IGridColumnMapping[] = this.gridModel.columns;
            const invisibleColumns: IGridColumnMapping[] = this.gridModel.invisibleColumns;
            const formatterMappings: IGridColumnMapping[] = [];
            // tslint:disable-next-line:no-any
            const dataViews: any = options.dataViews[0];
            const columns: DataViewMetadataColumn[] = dataViews.table.columns;
            const rows: DataViewTableRow[] = dataViews.table.rows;
            const visual: Visual = this;
            // tslint:disable-next-line:no-any
            const hierarchyTotals: any = [];
            // tslint:disable-next-line:no-any
            const transformedArr: any = [];
            const level: number = -1;
            let pressed: boolean = false;
            let moved: boolean = false;
            // tslint:disable-next-line:no-any
            let start: any;
            // tslint:disable-next-line:no-any
            let columnClass: any;
            let startX: number;
            let startWidth: number;
            let startGridWidth: number;
            const xDiff: number = 0;
            // tslint:disable-next-line:no-any
            let calculateWidth: any;
            // tslint:disable-next-line:no-any
            let calculatedGridWidth: any;

            visual.columnWidths = JSON.parse(this.persistResizeSettings.columnWidths || '{}');
            visual.expandCollapseStates = JSON.parse(this.persistExpandCollapseSettings.expandCollapseState || '{}');
            this.fillTargetColumns(visual);

            if (visual.persistResizeSettings.gridWidth) {
                this.grid.style('width', `${visual.persistResizeSettings.gridWidth}px`);
            }

            // tslint:disable-next-line:typedef semicolon no-any
            const col: any = columnMappings.map(function (d: IGridColumnMapping) {
                return { name: d.displayName };
            });

            // clear the selection on every update
            // tslint:disable-next-line:no-string-literal
            if (visual.selectionManager['selectedIds'].length) {
                visual.selectionManager.clear();
                visual.gridRows.style('opacity', 1);
                visual.gridRows.classed('row-selected', false);
            }

            // save sort settings
            // tslint:disable-next-line:typedef
            const saveSortSettings: {} = function (d: {}, sortIndex: number) {
                (<Event>d3.event).stopPropagation();

                // if selection is applied ignore sorting
                // tslint:disable-next-line:no-string-literal
                const isSelected: number = visual.selectionManager['selectedIds'].length;
                if (isSelected) {
                    return;
                }
                if (visual.firedResize) {
                    visual.firedResize = false;

                    return;
                }
                visual.persistSortSettings.columnIndex = sortIndex;
                visual.persistSortSettings.isSorted = true;
            };

            // get border width css rule
            // tslint:disable-next-line:typedef semicolon no-any
            const getBorderWidths: any = function (outline: string) {
                // tslint:disable-next-line:no-any
                const topWidth: any = 'frame' === outline || 'border-top' === outline || 'topBottom' === outline ? '1px' : 0;
                // tslint:disable-next-line:no-any
                const rightWidth: any = 'frame' === outline || 'border-right' === outline || 'leftRight' === outline ? '1px' : 0;
                // tslint:disable-next-line:no-any
                const bottomWidth: any = 'frame' === outline || 'border-bottom' === outline || 'topBottom' === outline ? '1px' : 0;
                // tslint:disable-next-line:no-any
                const leftWidth: any = 'frame' === outline || 'border-left' === outline || 'leftRight' === outline ? '1px' : 0;

                return `${topWidth} ${rightWidth} ${bottomWidth} ${leftWidth}`;
            };
            const leng: number = col.length;
            // bind data to grid header
            // tslint:disable-next-line:no-any
            const headerCells: any = this.header.selectAll('.headerCell')
                .data(col);

            // header cells exit function
            headerCells.exit()
                .remove();

            // header cells enter function
            headerCells.enter()
                .append('div')
                .classed('headerCell', true)
                .on('click', saveSortSettings);

            // header cells update function
            // tslint:disable-next-line:typedef
            headerCells.each(function (d: {}, headerIndex: number) {
                // tslint:disable-next-line:no-any
                const $this: any = this;
                const backgroundSelector: string = `backgroundColor${(headerIndex + 1).toString()}`;
                const fontSelector: string = `fontColor${(headerIndex + 1).toString()}`;
                const alignment: string = `alignment${(headerIndex + 1).toString()}`;
                if (columnMappings[headerIndex].isKPIMeasure) {
                    d3.select($this).style('display', 'none');

                    return;
                }
                // tslint:disable-next-line:no-any
                const className: any = `headerCell:nth(${headerIndex})`;

                // ;
                if (visual.gridModel.settings.color[alignment] === 'Auto') {
                    d3.select($this)
                        .text(`${columnMappings[headerIndex].displayName} `)
                        .style('display', 'table-cell')
                        .classed(`header-${headerIndex}`, true)
                        .classed('hierarchy', visual.gridModel.settings.gridSettings.showHierarchy)
                        .classed('sortActive', visual.persistSortSettings.isSorted
                        && headerIndex === visual.persistSortSettings.columnIndex
                        && !visual.gridModel.settings.gridSettings.showHierarchy)
                        .classed('hoverColor', true)
                        .style('background-color', visual.gridModel.settings.color[backgroundSelector])
                        .style('text-align', 'left')
                        .style('color', visual.gridModel.settings.color[fontSelector]);
                } else {
                    d3.select($this)
                        .text(`${columnMappings[headerIndex].displayName} `)
                        .style('display', 'table-cell')
                        .classed(`header-${headerIndex}`, true)
                        .classed('hierarchy', visual.gridModel.settings.gridSettings.showHierarchy)
                        .classed('sortActive', visual.persistSortSettings.isSorted
                        && headerIndex === visual.persistSortSettings.columnIndex
                        && !visual.gridModel.settings.gridSettings.showHierarchy)
                        .classed('hoverColor', true)
                        .style('background-color', visual.gridModel.settings.color[backgroundSelector])
                        .style('text-align', visual.gridModel.settings.color[alignment])
                        .style('color', visual.gridModel.settings.color[fontSelector]);
                }

                if (!visual.gridModel.settings.color.show) {
                    d3.select($this).style('color', visual.gridModel.settings.columnHeaders.fontColor)
                        .style('background-color', visual.gridModel.settings.columnHeaders.backgroundColor)
                        .style('text-align', 'left');
                    d3.selectAll(`.row-${headerIndex}`).style('text-align', 'left');
                }
            })
                .style('font-size', `${visual.gridModel.settings.gridSettings.fontSize}px`)
                .style('font-family', visual.gridModel.settings.gridSettings.fontFamily)
                .style('border-style', 'solid')
                .style('border-color', visual.gridModel.settings.gridSettings.outlineColor)
                .style('border-width', getBorderWidths(visual.gridModel.settings.columnHeaders.outline));

            headerCells.append('span')
                .style('font-size', `${Math.max(visual.gridModel.settings.gridSettings.fontSize - 5, 8)}px`)
                .style('color', visual.gridModel.settings.columnHeaders.fontColor)
                .style('margin-left', '5px')
                .classed('sortIcon', true);

            // add resizers to header cells
            this.header.selectAll('.headerCell')
                // tslint:disable-next-line:typedef
                .each(function (d: {}, headerIndex: number) {
                    // tslint:disable-next-line:no-any
                    const $this: any = this;
                    // tslint:disable-next-line:no-any
                    const className: any = `headerCell:nth(${headerIndex})`;
                    if (visual.columnWidths[className]) {
                        $(`.${className}`).width(visual.columnWidths[className]);
                    }
                })
                .append('span')
                .attr({
                    // tslint:disable-next-line:typedef
                    columnId: function (d: {}, headerIndex: number) { return `headerCell:nth(${headerIndex})`; }
                })
                .classed('resizer', true);

            // mouse down event to start the drag
            // tslint:disable-next-line:typedef
            $('.resizer').mousedown(function (e: JQueryMouseEventObject) {
                visual.firedResize = true;
                columnClass = this.getAttribute('columnId');
                start = $(`.${columnClass}`);
                pressed = true;
                startX = e.pageX;
                startWidth = start.width();
                startGridWidth = $('.gridBody').width();
            });

            // mouse move event to resize the columns
            // tslint:disable-next-line:typedef
            $(document).mousemove(function (e: JQueryMouseEventObject) {
                if (pressed) {
                    moved = true;
                    const xDifference: number = (e.pageX - startX);
                    calculateWidth = startWidth + xDifference - 23;
                    calculatedGridWidth = startGridWidth + xDifference;
                    $(start).width(calculateWidth);
                    // tslint:disable-next-line:no-any
                    const openingBracket: string = columnClass.split('(');
                    const getIndex: string[] = openingBracket[1].split(')');
                    d3.selectAll(`.row-${getIndex[0]}> .textSpan`);
                    d3.selectAll(`.header-${getIndex[0]}`);
                    $('.MAQGrid').width(calculatedGridWidth);
                }
            });

            // mouse up event to stop the drag and save the column widths
            // tslint:disable-next-line:typedef
            $(document).mouseup(function (e: JQueryMouseEventObject) {
                if (pressed) {
                    saveResizeSettings();
                    pressed = false;
                }
                if (moved && columnClass) {
                    columnClass = undefined;
                    moved = false;
                }
            });

            // persist resize settings
            // tslint:disable-next-line:typedef semicolon no-any
            const saveResizeSettings: any = function () {
                visual.columnWidths[columnClass] = calculateWidth;
                visual.persistResizeSettings.gridWidth = calculatedGridWidth;
                visual.persistResizeSettings.columnWidths = JSON.stringify(visual.columnWidths);
                visual.persistResizeState();
            };

            // bind data to grid rows
            visual.gridRows = this.body.selectAll('.gridRow')
                .data(rows);

            // grid rows exit function
            visual.gridRows.exit()
                .remove();

            // grid rows enter function
            visual.gridRows.enter()
                .append('div')
                .classed('gridRow', true)
                // tslint:disable-next-line:typedef
                .each(function (d: {}, rowIndex: number) {
                    d3.select(this).classed(`row${rowIndex}`, true);
                });

            // grid rows update
            // tslint:disable-next-line:typedef
            visual.gridRows.each(function (d: {}, rowIndex: number) {
                // tslint:disable-next-line:no-any
                const $this: any = this;
                // tslint:disable-next-line:no-any
                const gridRow: any = d3.select($this)
                    .style('display', 'table-row');
            });

            cloumnIndex = [];
            columnIndexInvisibleColumn = [];

            // tslint:disable-next-line:typedef
            columnMappings.forEach(function (element: IGridColumnMapping, index: number) {
                cloumnIndex.push({
                    columnName: element.displayName,
                    index: index
                });
            });

            // tslint:disable-next-line:typedef
            columnMappings.forEach(function (element: IGridColumnMapping, index: number) {
                columnIndexInvisibleColumn.push({
                    columnName: element.displayName.toLowerCase(),
                    index: index
                });
            });
            // bind data to grid cells
            // tslint:disable-next-line:no-any
            const gridCells: any = visual.gridRows.selectAll('.rowCell')
                // tslint:disable-next-line:typedef
                .data(function (d: DataViewTableRow) {
                    return d;
                });

            // grid cells exit function
            gridCells.exit()
                .remove();

            // grid cells enter function
            gridCells.enter()
                .append('div')
                .classed('rowCell', true);

            // tslint:disable-next-line:no-any
            const thisObj: any = this;

            d3.selectAll(`.row-${(leng - 1)}`).style('border-right', 0);
            d3.selectAll('.headerCell').style('padding', `${visual.gridModel.settings.gridSettings.rowpadding}px`);
            d3.selectAll('.rowCell').style('padding', `${visual.gridModel.settings.gridSettings.rowpadding}px`);

            if (visual.gridModel.settings.gridSettings.horizontalGrid) {
                d3.selectAll('.rowCell').style({
                    'border-bottom':
                        `${visual.gridModel.settings.gridSettings.horizontalGridThickness}px solid ${visual
                            .gridModel.settings.gridSettings.horizontalGridColor}`,
                    'border-right':
                        `${visual.gridModel.settings.gridSettings.verticalGridThickness}px solid ${visual
                            .gridModel.settings.gridSettings.verticalGridColor}`
                });
            } else {
                d3.selectAll('.rowCell').style({'border-bottom': '', 'border-right': ''});
                d3.select(`.row${(options.dataViews[0].table.rows.length - 1)}`).style('border-bottom', '');
                d3.selectAll(`.row-${(leng - 1)}`).style('border-right', '');
            }
            if (visual.gridModel.settings.gridSettings.verticalGrid) {
                d3.selectAll('.headerCell').style({
                    'border-right':
                    `${visual.gridModel.settings.gridSettings.verticalGridThickness}px solid ${visual
                        .gridModel.settings.gridSettings.verticalGridColor}`});
                d3.selectAll(`.header-${(leng - 1)}`).style('border-right', `${0}px`);
                d3.selectAll('.rowCell').style('border-right',
                                               `${visual.gridModel.settings.gridSettings.verticalGridThickness}px solid ${visual
                        .gridModel.settings.gridSettings.verticalGridColor}`);
            } else {
                d3.selectAll('.headerCell').style('border-right', '');
                d3.selectAll(`.header-${(leng - 1)}`).style('border-right', `${0}px`);
                d3.selectAll('.rowCell').style('border-right', '');
            }

            // grid cells update function
            // tslint:disable-next-line:typedef
            gridCells.each(function (d: {}, gridCellIndex: number, j: number) {
                const displayVal: number = 0;
                const alignment: string = `alignment${(gridCellIndex + 1).toString()}`;
                valFormatter = undefined;
                let formatter: IValueFormatter;

                // tslint:disable-next-line:no-any
                const $this: any = this;

                if (columnMappings[gridCellIndex].isKPIMeasure) {
                    d3.select($this).style('display', 'none');

                    return;
                }

                if (null === d || '' === d.toString().trim()) {
                    d = ' ';
                }

                if (options.dataViews[0].table.columns[gridCellIndex].format &&
                    (options.dataViews[0].table.columns[gridCellIndex].format.indexOf('#') > -1
                        || options.dataViews[0].table.columns[gridCellIndex].format.length === 1)
                    && d !== ' ') {
                    let displayValue: string;
                    const tempData: string = d.toString();
                    const tempValue: number = (tempData.split('.')[0]).replace(/[^0-9]/g, '').length;
                    displayValue = thisObj.returnDisplayValue(tempValue);
                    formatter = ValueFormatter.create({
                        format: options.dataViews[0].table.columns[gridCellIndex].format,

                        value: displayValue,
                        precision: getValue(updateDataView.metadata.objects, 'gridSettings', 'decimalValue', 0)
                    });

                    valFormatter = ValueFormatter.create({
                        format: options.dataViews[0].table.columns[gridCellIndex].format,
                        value: getValue(updateDataView.metadata.objects, 'gridSettings', 'displayUnits', 0) === 0 ?
                            0 : getValue(updateDataView.metadata.objects, 'gridSettings', 'displayUnits', 0),
                        precision: getValue(updateDataView.metadata.objects, 'gridSettings', 'decimalValue', 0)
                    });
                }

                // tslint:disable-next-line:no-any
                const gridCell: any = d3.select($this);
                //gridCell.html('');
                gridCell.selectAll('*').remove();
                gridCell.style('padding-left', '5px');
                // tslint:disable-next-line:no-any
                const className: any = `headerCell:nth(${gridCellIndex})`;
                const width: number = $(`.${className}`).width();

                gridCell.style('display', 'table-cell')
                    .classed(`row-${gridCellIndex}`, true)
                    .style('font-size', `${visual.gridModel.settings.gridSettings.fontSize}px`)
                    .style('font-family', visual.gridModel.settings.gridSettings.fontFamily)
                    .classed('hoverColor', true);

                if (getValue(updateDataView.metadata.objects, 'gridSettings', 'displayUnits', 0) === 0) {
                    if (formatter) {
                        gridCell.append('span').text(formatter.format(d))
                            .classed('textSpan', true)
                            .attr('title', columnMappings[gridCellIndex].formatter.format(d));
                    } else {
                        gridCell.append('span').text(columnMappings[gridCellIndex].formatter.format(d))
                            .classed('textSpan', true)
                            .attr('title', columnMappings[gridCellIndex].formatter.format(d));
                    }
                } else {
                    if (valFormatter) {
                        gridCell.append('span').text(valFormatter.format(d))
                            .classed('textSpan', true)
                            .attr('title', columnMappings[gridCellIndex].formatter.format(d));
                    } else {
                        gridCell.append('span').text(columnMappings[gridCellIndex].formatter.format(d))
                            .classed('textSpan', true)
                            .attr('title', columnMappings[gridCellIndex].formatter.format(d));
                    }
                }

                if (visual.gridModel.settings.color[alignment] === 'Auto') {
                    if (options.dataViews[0].table.columns[gridCellIndex].type.numeric
                        || options.dataViews[0].table.columns[gridCellIndex].type.integer
                        || options.dataViews[0].table.columns[gridCellIndex].type.dateTime) {
                        // tslint:disable-next-line:no-any
                        const $rows: any = d3.selectAll(`.row-${gridCellIndex}`);
                        $rows.style('text-align', 'right');

                    } else {
                        // tslint:disable-next-line:no-any
                        const $rows: any = d3.selectAll(`.row-${gridCellIndex}`);
                        $rows.style('text-align', 'left');
                    }
                } else {
                    d3.selectAll(`.row-${gridCellIndex}`).style('text-align', visual.gridModel.settings.color[alignment]);
                }

                gridCell.style('background-color', 'white');
                visual.applyConditioanlFormatting(columnMappings, gridCellIndex, rows, gridCell, j);

            });
            // footer section
            let totalTextUsed: boolean = false;

            // tslint:disable-next-line:typedef
            const footerTextUpdate = function (ele, d, elementIndex) {
                let total: number = 0;
                const prevTotal: number = 0;
                let parseFailed: boolean = false;
                const alignment: string = `alignment${(elementIndex + 1).toString()}`;

                if (visual.gridModel.settings.gridSettings.showHierarchy) {
                    if (isNaN(+hierarchyTotals[elementIndex])) {
                        parseFailed = true;
                    } else {
                        total = hierarchyTotals[elementIndex];
                    }

                } else {
                    // tslint:disable-next-line:typedef
                    visual.gridRows.each(function (row) {
                        let val: string = '';
                        if (row[elementIndex] || 0 === row[elementIndex]) {
                            val = row[elementIndex].toString();
                        }

                        if ('' === val || isNaN(+val)) {
                            parseFailed = true;
                        } else {
                            total += +val;
                        }
                    });
                }
                if (visual.gridModel.settings.color[alignment] === 'Auto') {
                    if (options.dataViews[0].table.columns[elementIndex].type.numeric
                        || options.dataViews[0].table.columns[elementIndex].type.integer
                        || options.dataViews[0].table.columns[elementIndex].type.dateTime) {

                        // tslint:disable-next-line:typedef
                        const $rows = d3.selectAll(`.row-${elementIndex}`);
                        $rows.style('text-align', 'right');

                    } else {
                        // tslint:disable-next-line:typedef
                        const $rows = d3.selectAll(`.row-${elementIndex}`);
                        $rows.style('text-align', 'left');
                    }
                } else {
                    d3.selectAll(`.row-${elementIndex}`).style('text-align', visual.gridModel.settings.color[alignment]);
                }

                // tslint:disable-next-line:typedef
                const className = `headerCell:nth(${elementIndex})`;
                // tslint:disable-next-line:typedef
                const width = visual.columnWidths[className] === undefined
                    ? $(`.${className}`).width()
                    : visual.columnWidths[className];

                // tslint:disable-next-line:typedef
                const result = parseFailed ? totalTextUsed ? '' : 'Total' : parseFloat(total.toFixed(3));
                totalTextUsed = !totalTextUsed ? parseFailed : totalTextUsed;

                ele.text(columnMappings[elementIndex].formatter.format(result))
                    .classed(`row-${elementIndex}`, true);

            };

            // bind data to footer cells
            // tslint:disable-next-line:typedef
            const footerCells = this.footer.selectAll('.footerCell')
                .data(col);

            // footer cells exit function
            footerCells.exit()
                .remove();

            // footer cells enter function
            footerCells.enter()
                .append('div')
                .classed('footerCell', true);

            // footer cells update function
            // tslint:disable-next-line:typedef
            footerCells.each(function (d, footerIndex) {
                // tslint:disable-next-line:typedef
                const $this = d3.select(this);
                const alignment: string = `alignment${(footerIndex + 1).toString()}`;
                if (columnMappings[footerIndex].isKPIMeasure) {
                    $this.style('display', 'none');

                    return;
                }

                $this.classed(`row-${footerIndex}`, true)
                    .style('display', 'table-cell');

                footerTextUpdate($this, d, footerIndex);
            })
                .style('font-size', `${visual.gridModel.settings.gridSettings.fontSize}px`)
                .style('font-family', visual.gridModel.settings.gridSettings.fontFamily)
                .style('color', visual.gridModel.settings.totalSettings.fontColor)
                .style('background-color', visual.gridModel.settings.totalSettings.backgroundColor)
                .style('border-style', 'solid')
                .style('border-color', visual.gridModel.settings.gridSettings.outlineColor)
                .style('border-width', getBorderWidths(visual.gridModel.settings.totalSettings.outline));

            if (!visual.gridModel.settings.totalSettings.show) {
                this.footer.selectAll('.footerCell').remove();
            }

            // selection id and expand/collapse section
            const tableSelectionId: ISelectionId[] = this.getSelectionIds(dataViews, this.host);

            // tslint:disable-next-line:typedef
            d3.select('html').on('click', function () {
                // tslint:disable-next-line:no-string-literal
                if (visual.selectionManager['selectedIds'].length) {
                    visual.selectionManager.clear();
                    visual.gridRows.style('opacity', 1);
                    visual.gridRows.classed('row-selected', false);
                }
            });

            // tslint:disable-next-line:typedef
            visual.gridRows.on('click', function (d, rowIndex) {
                const selectionId: ISelectionId = tableSelectionId[rowIndex];
                // tslint:disable-next-line:no-string-literal
                const isSelected: boolean = visual.selectionManager['selectedIds'].length;
                // tslint:disable-next-line:typedef
                visual.selectionManager.select(selectionId).then((ids) => {
                    if (isSelected && d3.select(this).classed('row-selected')) {
                        visual.gridRows.style('opacity', 1);
                        d3.select(this).classed('row-selected', false);
                    } else {
                        visual.gridRows.style('opacity', 0.3);
                        d3.select(this).style('opacity', 1);
                        d3.select(this).classed('row-selected', true);
                    }
                    (<Event>d3.event).stopPropagation();
                });
            });

            for (let iterator: number = 0; iterator < invisibleColumns.length; iterator++) {
                // tslint:disable-next-line:typedef
                const element: IColumnIndex[] = cloumnIndex.filter(column => column.columnName === invisibleColumns[iterator].displayName);
                if (element.length > 0) {
                    $(`.header-${element[0].index.toString()}`).hide();
                    $(`.row-${element[0].index.toString()}`).hide();
                }
            }
            //this.hideLoading();
        }

        // public hideLoading() {
        //     $('.annotationLoading').hide();
        //     $('.gridContainer').show();
        // }

        // public showLoading() {
        //     $('.annotationLoading').show();
        // }

        // tslint:disable-next-line:typedef
        public applyConditioanlFormatting(columnMappings: IGridColumnMapping[],
                                          gridCellIndex: number,
                                          rows: DataViewTableRow[],
                                          // tslint:disable-next-line:no-any
                                          gridCell: any,
                                          j: number ) {
            const targetCol: ITargetColumns[] = targetColumns
            // tslint:disable-next-line:typedef
            .filter(column => column.targetColumnName.toLowerCase() === columnMappings[gridCellIndex].displayName.toLowerCase());

            if (targetCol.length > 0) {
            for (let iterator: number = 0; iterator < 27; iterator++) {
                if (iterator === 0) {
                    if (columnMappings[gridCellIndex].displayName.toLowerCase() ===
                            gridSettings.conditionalFormatting.targetColumn.toLowerCase()) {
                        const test: IColumnIndex[] = columnIndexInvisibleColumn
                            // tslint:disable-next-line:typedef
                            .filter(column => column.columnName === gridSettings.conditionalFormatting.sourceColumn.toLowerCase());
                        if (test.length > 0) {
                            this.changeCellColor(gridCell,
                                                 j,
                                                 test[0].index,
                                                 gridSettings.conditionalFormatting.sourceValue,
                                                 gridSettings.conditionalFormatting.targetValue,
                                                 gridSettings.conditionalFormatting.fontColor,
                                                 gridSettings.conditionalFormatting.fromRuleSet,
                                                 gridSettings.conditionalFormatting.toRuleSet,
                                                 rows);
                        }
                    }
                } else if (iterator === 1) {
                    if (columnMappings[gridCellIndex].displayName.toLowerCase() ===
                            gridSettings.conditionalFormatting.targetColumn1.toLowerCase()
                        && gridSettings.conditionalFormatting.layout) {
                        const test: IColumnIndex[] = columnIndexInvisibleColumn
                            // tslint:disable-next-line:typedef
                            .filter(column => column.columnName ===
                                        gridSettings.conditionalFormatting.sourceColumn1.toLowerCase());
                        if (test.length > 0) {
                            this.changeCellColor(gridCell,
                                                 j,
                                                 test[0].index,
                                                 gridSettings.conditionalFormatting.sourceValue1,
                                                 gridSettings.conditionalFormatting.targetValue1,
                                                 gridSettings.conditionalFormatting.fontColor1,
                                                 gridSettings.conditionalFormatting.fromRuleSet1,
                                                 gridSettings.conditionalFormatting.toRuleSet1,
                                                 rows
                            );
                        }
                    }
                } else if (columnMappings[gridCellIndex].displayName.toLowerCase() ===
                    gridSettings.conditionalFormatting[`targetColumn${(iterator).toString()}`].toLowerCase()
                    && gridSettings.conditionalFormatting[`layout${(iterator - 1).toString()}`]) {
                    const test: IColumnIndex[] = columnIndexInvisibleColumn
                        // tslint:disable-next-line:typedef
                        .filter(column => column.columnName ===
                            gridSettings.conditionalFormatting[`sourceColumn${(iterator).toString()}`].toLowerCase());
                    if (test.length > 0) {
                        this.changeCellColor(gridCell,
                                             j,
                                             test[0].index,
                                             gridSettings.conditionalFormatting[`sourceValue${(iterator).toString()}`],
                                             gridSettings.conditionalFormatting[`targetValue${(iterator).toString()}`],
                                             gridSettings.conditionalFormatting[`fontColor${(iterator).toString()}`],
                                             gridSettings.conditionalFormatting[`fromRuleSet${(iterator).toString()}`],
                                             gridSettings.conditionalFormatting[`toRuleSet${(iterator).toString()}`],
                                             rows
                        );
                    }
                }
            }

            for (let iterator: number = 27; iterator < 53; iterator++) {
                if (iterator === 27) {
                    if (columnMappings[gridCellIndex].displayName.toLowerCase() ===
                        gridSettings.conditionalFormatting1.targetColumn27.toLowerCase()) {
                        // tslint:disable-next-line:typedef
                        const test = columnIndexInvisibleColumn.filter(column => column.columnName ===
                            gridSettings.conditionalFormatting1.sourceColumn27.toLowerCase());
                        if (test.length > 0) {
                            this.changeCellColor(gridCell,
                                                 j,
                                                 test[0].index,
                                                 gridSettings.conditionalFormatting1.sourceValue27,
                                                 gridSettings.conditionalFormatting1.targetValue27,
                                                 gridSettings.conditionalFormatting1.fontColor27,
                                                 gridSettings.conditionalFormatting1.fromRuleSet27,
                                                 gridSettings.conditionalFormatting1.toRuleSet27,
                                                 rows);
                        }
                    }
                } else if (columnMappings[gridCellIndex].displayName.toLowerCase() ===
                    gridSettings.conditionalFormatting1[`targetColumn${(iterator).toString()}`].toLowerCase()
                    && gridSettings.conditionalFormatting1[`layout${(iterator - 1).toString()}`]) {
                    const test: IColumnIndex[] = columnIndexInvisibleColumn
                        // tslint:disable-next-line:typedef
                        .filter(column => column.columnName ===
                            gridSettings.conditionalFormatting1[`sourceColumn${(iterator).toString()}`].toLowerCase());
                    if (test.length > 0) {
                        this.changeCellColor(gridCell,
                                             j,
                                             test[0].index,
                                             gridSettings.conditionalFormatting1[`sourceValue${(iterator).toString()}`],
                                             gridSettings.conditionalFormatting1[`targetValue${(iterator).toString()}`],
                                             gridSettings.conditionalFormatting1[`fontColor${(iterator).toString()}`],
                                             gridSettings.conditionalFormatting1[`fromRuleSet${(iterator).toString()}`],
                                             gridSettings.conditionalFormatting1[`toRuleSet${(iterator).toString()}`],
                                             rows
                        );
                    }
                }
            }

            this.applyAdditionalConditioanlFormatting(columnMappings,
                                                      gridCellIndex,
                                                      rows,
                                                      gridCell,
                                                      j );
        }
        }

        // tslint:disable-next-line:typedef
        public applyAdditionalConditioanlFormatting(columnMappings: IGridColumnMapping[],
                                                    gridCellIndex: number,
                                                    rows: DataViewTableRow[],
                                                    // tslint:disable-next-line:no-any
                                                    gridCell: any,
                                                    j: number) {
            const targetCol: ITargetColumns[] = targetColumns
                // tslint:disable-next-line:typedef
                .filter(column => column.targetColumnName.toLowerCase() === columnMappings[gridCellIndex].displayName.toLowerCase());

            if (targetCol.length > 0) {
                for (let iterator: number = 53; iterator < 79; iterator++) {
                    if (iterator === 53) {
                        if (columnMappings[gridCellIndex].displayName.toLowerCase() ===
                            gridSettings.conditionalFormatting2.targetColumn53.toLowerCase()) {
                            const test: IColumnIndex[] = columnIndexInvisibleColumn
                                // tslint:disable-next-line:typedef
                                .filter(column => column.columnName ===
                                    gridSettings.conditionalFormatting2.sourceColumn53.toLowerCase());
                            if (test.length > 0) {
                                this.changeCellColor(gridCell,
                                                     j,
                                                     test[0].index,
                                                     gridSettings.conditionalFormatting2.sourceValue53,
                                                     gridSettings.conditionalFormatting2.targetValue53,
                                                     gridSettings.conditionalFormatting2.fontColor53,
                                                     gridSettings.conditionalFormatting2.fromRuleSet53,
                                                     gridSettings.conditionalFormatting2.toRuleSet53,
                                                     rows);
                            }
                        }
                    } else if (columnMappings[gridCellIndex].displayName.toLowerCase() ===
                        gridSettings.conditionalFormatting2[`targetColumn${(iterator).toString()}`].toLowerCase()
                        && gridSettings.conditionalFormatting2[`layout${(iterator - 1).toString()}`]) {
                        const test: IColumnIndex[] = columnIndexInvisibleColumn
                            // tslint:disable-next-line:typedef
                            .filter(column => column.columnName ===
                                gridSettings.conditionalFormatting2[`sourceColumn${(iterator).toString()}`].toLowerCase());
                        if (test.length > 0) {
                            this.changeCellColor(gridCell,
                                                 j,
                                                 test[0].index,
                                                 gridSettings.conditionalFormatting2[`sourceValue${(iterator).toString()}`],
                                                 gridSettings.conditionalFormatting2[`targetValue${(iterator).toString()}`],
                                                 gridSettings.conditionalFormatting2[`fontColor${(iterator).toString()}`],
                                                 gridSettings.conditionalFormatting2[`fromRuleSet${(iterator).toString()}`],
                                                 gridSettings.conditionalFormatting2[`toRuleSet${(iterator).toString()}`],
                                                 rows
                            );
                        }
                    }
                }

                for (let iterator: number = 79; iterator <= 100; iterator++) {
                    if (iterator === 79) {
                        if (columnMappings[gridCellIndex].displayName.toLowerCase() ===
                            gridSettings.conditionalFormatting3.targetColumn79.toLowerCase()) {
                            const test: IColumnIndex[] = columnIndexInvisibleColumn
                                // tslint:disable-next-line:typedef
                                .filter(column => column.columnName ===
                                    gridSettings.conditionalFormatting3.sourceColumn79.toLowerCase());
                            if (test.length > 0) {
                                this.changeCellColor(gridCell,
                                                     j,
                                                     test[0].index,
                                                     gridSettings.conditionalFormatting3.sourceValue79,
                                                     gridSettings.conditionalFormatting3.targetValue79,
                                                     gridSettings.conditionalFormatting3.fontColor79,
                                                     gridSettings.conditionalFormatting3.fromRuleSet79,
                                                     gridSettings.conditionalFormatting3.toRuleSet79,
                                                     rows);
                            }
                        }
                    } else if (columnMappings[gridCellIndex].displayName.toLowerCase() ===
                        gridSettings.conditionalFormatting3[`targetColumn${(iterator).toString()}`].toLowerCase()
                        && gridSettings.conditionalFormatting3[`layout${(iterator - 1).toString()}`]) {
                        const test: IColumnIndex[] = columnIndexInvisibleColumn
                            // tslint:disable-next-line:typedef
                            .filter(column => column.columnName ===
                                gridSettings.conditionalFormatting3[`sourceColumn${(iterator).toString()}`].toLowerCase());
                        if (test.length > 0) {
                            this.changeCellColor(gridCell,
                                                 j,
                                                 test[0].index,
                                                 gridSettings.conditionalFormatting3[`sourceValue${(iterator).toString()}`],
                                                 gridSettings.conditionalFormatting3[`targetValue${(iterator).toString()}`],
                                                 gridSettings.conditionalFormatting3[`fontColor${(iterator).toString()}`],
                                                 gridSettings.conditionalFormatting3[`fromRuleSet${(iterator).toString()}`],
                                                 gridSettings.conditionalFormatting3[`toRuleSet${(iterator).toString()}`],
                                                 rows
                            );
                        }
                    }
                }
            }
        }

        // tslint:disable-next-line:typedef semicolon no-any
        public changeCellColor(gridCell: any,
                               rownumber: number,
                               headerIndex: number,
                               currentSourceValue: string,
                               currentTargetValue: string,
                               currentfontColor: string,
                               currentFromRuleSet: string,
                               currentToRuleSet: string,
                               rows: DataViewTableRow[]
        ) {
            if (rows[rownumber][headerIndex] !== null
                && parseFloat(currentSourceValue) === parseFloat(rows[rownumber][headerIndex].toString())
                && currentFromRuleSet === 'is') {
                gridCell.style('background-color', currentfontColor);
            } else if ((rows[rownumber][headerIndex] === null)
                && currentFromRuleSet === 'isBlank') {
                gridCell.style('background-color', currentfontColor);
            } else if (rows[rownumber][headerIndex] !== null
                && parseFloat(rows[rownumber][headerIndex].toString()) > parseFloat(currentSourceValue)
                && parseFloat(rows[rownumber][headerIndex].toString()) < parseFloat(currentTargetValue)
                && currentFromRuleSet === 'isGreaterThan'
                && currentToRuleSet === 'isLessThan') {
                gridCell.style('background-color', currentfontColor);
            }

            this.changeCellColorForMoreConditions(gridCell,
                                                  rownumber,
                                                  headerIndex,
                                                  currentSourceValue,
                                                  currentTargetValue,
                                                  currentfontColor,
                                                  currentFromRuleSet,
                                                  currentToRuleSet,
                                                  rows);
        }

        // tslint:disable-next-line:typedef semicolon no-any
        public changeCellColorForMoreConditions(gridCell: any,
                                                rownumber: number,
                                                headerIndex: number,
                                                currentSourceValue: string,
                                                currentTargetValue: string,
                                                currentfontColor: string,
                                                currentFromRuleSet: string,
                                                currentToRuleSet: string,
                                                rows: DataViewTableRow[]
        ) {
            if (rows[rownumber][headerIndex] !== null
                && parseFloat(rows[rownumber][headerIndex].toString()) >= parseFloat(currentSourceValue)
                && parseFloat(rows[rownumber][headerIndex].toString()) <= parseFloat(currentTargetValue)
                && currentFromRuleSet === 'isGreaterThanOrEqualTo'
                && currentToRuleSet === 'isLessThanOrEqualTo') {
                gridCell.style('background-color', currentfontColor);
            } else if (rows[rownumber][headerIndex] !== null
                && parseFloat(rows[rownumber][headerIndex].toString()) > parseFloat(currentSourceValue)
                && parseFloat(rows[rownumber][headerIndex].toString()) <= parseFloat(currentTargetValue)
                && currentFromRuleSet === 'isGreaterThan'
                && currentToRuleSet === 'isLessThanOrEqualTo') {
                gridCell.style('background-color', currentfontColor);
            } else if (rows[rownumber][headerIndex] !== null
                && parseFloat(rows[rownumber][headerIndex].toString()) >= parseFloat(currentSourceValue)
                && parseFloat(rows[rownumber][headerIndex].toString()) < parseFloat(currentTargetValue)
                && currentFromRuleSet === 'isGreaterThanOrEqualTo'
                && currentToRuleSet === 'isLessThan') {
                gridCell.style('background-color', currentfontColor);
            }
        }

        // tslint:disable-next-line:typedef
        public fillTargetColumns(visual: Visual) {
            for (let iterator: number = 0; iterator <= 100; iterator++) {
                if (iterator === 0) {
                    targetcolumnName = visual.gridModel
                    .settings.conditionalFormatting.targetColumn.toLowerCase();
                }
                if (iterator >= 1 && iterator <= 26) {
                    targetcolumnName = visual.gridModel
                        .settings.conditionalFormatting[`targetColumn${(iterator).toString()}`].toLowerCase();
                } else if (iterator >= 27 && iterator <= 52) {
                    targetcolumnName = visual.gridModel
                        .settings.conditionalFormatting1[`targetColumn${(iterator).toString()}`].toLowerCase();
                } else if (iterator >= 53 && iterator <= 78) {
                    targetcolumnName = visual.gridModel
                        .settings.conditionalFormatting2[`targetColumn${(iterator).toString()}`].toLowerCase();
                } else if (iterator >= 79 && iterator <= 100) {
                    targetcolumnName = visual.gridModel
                        .settings.conditionalFormatting3[`targetColumn${(iterator).toString()}`].toLowerCase();
                }
                const targetCol: ITargetColumns[] = targetColumns
                    // tslint:disable-next-line:typedef
                    .filter(column => column.targetColumnName === targetcolumnName);
                if (targetColumns.length === 0) {
                    targetColumns.push({
                        targetColumnName: targetcolumnName
                    });
                } else if (targetCol.length === 0) {
                    targetColumns.push({
                        targetColumnName: targetcolumnName
                    });
                }
            }
        }

        // tslint:disable-next-line:typedef
        public persistResizeState() {
            const properties: { [propertyName: string]: DataViewPropertyValue } = {};
            // tslint:disable-next-line:no-string-literal
            properties['columnWidths'] = this.gridModel.settings.persistResizeSettings.columnWidths;
            // tslint:disable-next-line:no-string-literal
            properties['gridWidth'] = this.gridModel.settings.persistResizeSettings.gridWidth;
            const persistSettings: VisualObjectInstancesToPersist = {
                replace: [
                    <VisualObjectInstance>{
                        objectName: 'persistResizeSettings',
                        selector: null,
                        properties: properties
                    }]
            };
            this.host.persistProperties(persistSettings);
        }
        private static parseSettings(dataViewSettings: DataView): VisualSettings {
            return VisualSettings.parse(dataViewSettings) as VisualSettings;
        }

        // selection id function
        public getSelectionIds(dataViewSelection: DataView, host: IVisualHost): ISelectionId[] {
            return dataViewSelection.table.identity.map((identity: DataViewScopeIdentity) => {
                const categoryColumn: DataViewCategoryColumn = {
                    source: dataViewSelection.table.columns[0],
                    values: null,
                    identity: [identity]
                };

                return host.createSelectionIdBuilder()
                    .withCategory(categoryColumn, 0)
                    .createSelectionId();
            });
        }
        /**
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
         * objects and properties you want to expose to the users in the property pane.
         *
         */
        // tslint:disable-next-line:cyclomatic-complexity
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions):
            VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            const objectName: string = options.objectName;
            const objectEnumeration: VisualObjectInstance[] = [];

            if ('persistSortSettings' === objectName
                || 'persistResizeSettings' === objectName
                || 'persistExpandCollapseSettings' === objectName) {
                return objectEnumeration;
            } else if ('color' === objectName) {
                for (let headCounter: number = 0; headCounter < Visual.columnheaderdataViews.table.columns.length; headCounter++) {

                    if (Visual.columnheaderdataViews.table.columns[headCounter].roles.invisibleColumns !== true) {
                        const columnName: string = `sourceColumn${(headCounter + 1).toString()}`;
                        const backgroundName: string = `backgroundColor${(headCounter + 1).toString()}`;
                        const fontName: string = `fontColor${(headCounter + 1).toString()}`;
                        const alignment: string = `alignment${(headCounter + 1).toString()}`;

                        objectEnumeration.push({
                            objectName: options.objectName,
                            properties:
                                {
                                    columnName: this.gridModel.settings.color[columnName],
                                    backgroundName: this.gridModel.settings.color[backgroundName],
                                    fontName: this.gridModel.settings.color[fontName],
                                    alignment: this.gridModel.settings.color[alignment]
                                },
                            selector: null
                        });
                    }
                }
            } else if ('conditionalFormatting' === objectName) {
                // tslint:disable-next-line:typedef
                const objProps = {};
                // tslint:disable-next-line:typedef
                const objProps0 = {};
                if ('isBlank' === this.gridModel.settings.conditionalFormatting['fromRuleSet'.toString()]) {
                    objProps0['sourceColumn'.toString()] = this.gridModel.settings.conditionalFormatting['sourceColumn'.toString()];
                    objProps0['fromRuleSet'.toString()] = this.gridModel.settings.conditionalFormatting['fromRuleSet'.toString()];
                    objProps0['targetColumn'.toString()] = this.gridModel.settings.conditionalFormatting['targetColumn'.toString()];
                    objProps0['fontColor'.toString()] = this.gridModel.settings.conditionalFormatting['fontColor'.toString()];
                    objProps0['layout'.toString()] = this.gridModel.settings.conditionalFormatting['layout'.toString()];
                } else if ('is' === this.gridModel.settings.conditionalFormatting['fromRuleSet'.toString()]) {
                    objProps0['sourceColumn'.toString()] = this.gridModel.settings.conditionalFormatting['sourceColumn'.toString()];
                    objProps0['fromRuleSet'.toString()] = this.gridModel.settings.conditionalFormatting['fromRuleSet'.toString()];
                    objProps0['sourceValue'.toString()] = this.gridModel.settings.conditionalFormatting['sourceValue'.toString()];
                    objProps0['targetColumn'.toString()] = this.gridModel.settings.conditionalFormatting['targetColumn'.toString()];
                    objProps0['fontColor'.toString()] = this.gridModel.settings.conditionalFormatting['fontColor'.toString()];
                    objProps0['layout'.toString()] = this.gridModel.settings.conditionalFormatting['layout'.toString()];
                } else {
                    objProps0['sourceColumn'.toString()] = this.gridModel.settings.conditionalFormatting['sourceColumn'.toString()];
                    objProps0['fromRuleSet'.toString()] = this.gridModel.settings.conditionalFormatting['fromRuleSet'.toString()];
                    objProps0['sourceValue'.toString()] = this.gridModel.settings.conditionalFormatting['sourceValue'.toString()];
                    objProps0['toRuleSet'.toString()] = this.gridModel.settings.conditionalFormatting['toRuleSet'.toString()];
                    objProps0['targetValue'.toString()] = this.gridModel.settings.conditionalFormatting['targetValue'.toString()];
                    objProps0['targetColumn'.toString()] = this.gridModel.settings.conditionalFormatting['targetColumn'.toString()];
                    objProps0['fontColor'.toString()] = this.gridModel.settings.conditionalFormatting['fontColor'.toString()];
                    objProps0['layout'.toString()] = this.gridModel.settings.conditionalFormatting['layout'.toString()];
                }
                objectEnumeration.push({
                    objectName: options.objectName,
                    properties: objProps0,
                    selector: null
                });

                for (let i: number = 0; i < 26; i++) {
                    if (i === 0 && this.gridModel.settings.conditionalFormatting.layout) {
                        if ('isBlank' === this.gridModel.settings.conditionalFormatting[`fromRuleSet${(i + 1).toString()}`]) {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`layout${(i + 1).toString()}`];
                        } else if ('is' === this.gridModel.settings.conditionalFormatting[`fromRuleSet${(i + 1).toString()}`]) {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`sourceValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`sourceValue${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`layout${(i + 1).toString()}`];
                        } else {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`sourceValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`sourceValue${(i + 1).toString()}`];
                            objProps[`toRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`toRuleSet${(i + 1).toString()}`];
                            objProps[`targetValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`targetValue${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`layout${(i + 1).toString()}`];
                        }

                    } else if (this.gridModel.settings.conditionalFormatting[`layout${i}`]) {
                        if ('isBlank' === this.gridModel.settings.conditionalFormatting[`fromRuleSet${(i + 1).toString()}`]) {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`layout${(i + 1).toString()}`];
                        } else if ('is' === this.gridModel.settings.conditionalFormatting[`fromRuleSet${(i + 1).toString()}`]) {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`sourceValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`sourceValue${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`layout${(i + 1).toString()}`];
                        } else {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`sourceValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`sourceValue${(i + 1).toString()}`];
                            objProps[`toRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`toRuleSet${(i + 1).toString()}`];
                            objProps[`targetValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`targetValue${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting[`layout${(i + 1).toString()}`];
                        }
                    }
                }

                objectEnumeration.push({
                    objectName: options.objectName,
                    properties: objProps,
                    selector: null
                });

                return objectEnumeration;
            } else if ('conditionalFormatting1' === objectName) {
                // tslint:disable-next-line:typedef
                const objProps = {};
                // tslint:disable-next-line:typedef
                const objProps27 = {};
                if ('isBlank' === this.gridModel.settings.conditionalFormatting1['fromRuleSet27'.toString()]) {
                    objProps27['sourceColumn27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['sourceColumn27'.toString()];
                    objProps27['fromRuleSet27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['fromRuleSet27'.toString()];
                    objProps27['targetColumn27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['targetColumn27'.toString()];
                    objProps27['fontColor27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['fontColor27'.toString()];
                    objProps27['layout27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['layout27'.toString()];
                } else if ('is' === this.gridModel.settings.conditionalFormatting1['fromRuleSet27'.toString()]) {
                    objProps27['sourceColumn27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['sourceColumn27'.toString()];
                    objProps27['fromRuleSet27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['fromRuleSet27'.toString()];
                    objProps27['sourceValue27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['sourceValue27'.toString()];
                    objProps27['targetColumn27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['targetColumn27'.toString()];
                    objProps27['fontColor27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['fontColor27'.toString()];
                    objProps27['layout27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['layout27'.toString()];
                } else {
                    objProps27['sourceColumn27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['sourceColumn27'.toString()];
                    objProps27['fromRuleSet27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['fromRuleSet27'.toString()];
                    objProps27['sourceValue27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['sourceValue27'.toString()];
                    objProps27['toRuleSet27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['toRuleSet27'.toString()];
                    objProps27['targetValue27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['targetValue27'.toString()];
                    objProps27['targetColumn27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['targetColumn27'.toString()];
                    objProps27['fontColor27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['fontColor27'.toString()];
                    objProps27['layout27'.toString()] =
                        this.gridModel.settings.conditionalFormatting1['layout27'.toString()];
                }
                objectEnumeration.push({
                    objectName: options.objectName,
                    properties: objProps27,
                    selector: null
                });
                for (let i: number = 27; i < 54; i++) {
                    if (this.gridModel.settings.conditionalFormatting1[`layout${i}`]) {
                        if ('isBlank' === this.gridModel.settings.conditionalFormatting1[`fromRuleSet${(i + 1).toString()}`]) {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`layout${(i + 1).toString()}`];
                        } else if ('is' === this.gridModel.settings.conditionalFormatting1[`fromRuleSet${(i + 1).toString()}`]) {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`sourceValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`sourceValue${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`layout${(i + 1).toString()}`];
                        } else {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`sourceValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`sourceValue${(i + 1).toString()}`];
                            objProps[`toRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`toRuleSet${(i + 1).toString()}`];
                            objProps[`targetValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`targetValue${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting1[`layout${(i + 1).toString()}`];
                        }
                    }
                }

                objectEnumeration.push({
                    objectName: options.objectName,
                    properties: objProps,
                    selector: null
                });

                return objectEnumeration;
            } else if ('conditionalFormatting2' === objectName) {
                // tslint:disable-next-line:typedef
                const objProps53 = {};
                if ('isBlank' === this.gridModel.settings.conditionalFormatting2['fromRuleSet53'.toString()]) {
                    objProps53['sourceColumn53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['sourceColumn53'.toString()];
                    objProps53['fromRuleSet53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['fromRuleSet53'.toString()];
                    objProps53['targetColumn53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['targetColumn53'.toString()];
                    objProps53['fontColor53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['fontColor53'.toString()];
                    objProps53['layout53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['layout53'.toString()];
                } else if ('is' === this.gridModel.settings.conditionalFormatting2['fromRuleSet53'.toString()]) {
                    objProps53['sourceColumn53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['sourceColumn53'.toString()];
                    objProps53['fromRuleSet53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['fromRuleSet53'.toString()];
                    objProps53['sourceValue53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['sourceValue53'.toString()];
                    objProps53['targetColumn53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['targetColumn53'.toString()];
                    objProps53['fontColor53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['fontColor53'.toString()];
                    objProps53['layout53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['layout53'.toString()];
                } else {
                    objProps53['sourceColumn53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['sourceColumn53'.toString()];
                    objProps53['fromRuleSet53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['fromRuleSet53'.toString()];
                    objProps53['sourceValue53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['sourceValue53'.toString()];
                    objProps53['toRuleSet53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['toRuleSet53'.toString()];
                    objProps53['targetValue53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['targetValue53'.toString()];
                    objProps53['targetColumn53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['targetColumn53'.toString()];
                    objProps53['fontColor53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['fontColor53'.toString()];
                    objProps53['layout53'.toString()] =
                        this.gridModel.settings.conditionalFormatting2['layout53'.toString()];
                }
                objectEnumeration.push({
                    objectName: options.objectName,
                    properties: objProps53,
                    selector: null
                });

                // tslint:disable-next-line:typedef
                const objProps = {};
                for (let i: number = 53; i < 80; i++) {
                    if (this.gridModel.settings.conditionalFormatting2[`layout${i}`]) {
                        if ('isBlank' === this.gridModel.settings.conditionalFormatting2[`fromRuleSet${(i + 1).toString()}`]) {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`layout${(i + 1).toString()}`];
                        } else if ('is' === this.gridModel.settings.conditionalFormatting2[`fromRuleSet${(i + 1).toString()}`]) {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`sourceValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`sourceValue${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`layout${(i + 1).toString()}`];
                        } else {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`sourceValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`sourceValue${(i + 1).toString()}`];
                            objProps[`toRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`toRuleSet${(i + 1).toString()}`];
                            objProps[`targetValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`targetValue${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting2[`layout${(i + 1).toString()}`];
                        }
                    }
                }

                objectEnumeration.push({
                    objectName: options.objectName,
                    properties: objProps,
                    selector: null
                });

                return objectEnumeration;

            } else if ('conditionalFormatting3' === objectName) {
                // tslint:disable-next-line:typedef
                const objProps79 = {};
                if ('isBlank' === this.gridModel.settings.conditionalFormatting3['fromRuleSet79'.toString()]) {
                    objProps79['sourceColumn79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['sourceColumn79'.toString()];
                    objProps79['fromRuleSet79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['fromRuleSet79'.toString()];
                    objProps79['targetColumn79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['targetColumn79'.toString()];
                    objProps79['fontColor79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['fontColor79'.toString()];
                    objProps79['layout79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['layout79'.toString()];
                } else if ('is' === this.gridModel.settings.conditionalFormatting3['fromRuleSet79'.toString()]) {
                    objProps79['sourceColumn79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['sourceColumn79'.toString()];
                    objProps79['fromRuleSet79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['fromRuleSet79'.toString()];
                    objProps79['sourceValue79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['sourceValue79'.toString()];
                    objProps79['targetColumn79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['targetColumn79'.toString()];
                    objProps79['fontColor79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['fontColor79'.toString()];
                    objProps79['layout79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['layout79'.toString()];
                } else {
                    objProps79['sourceColumn79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['sourceColumn79'.toString()];
                    objProps79['fromRuleSet79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['fromRuleSet79'.toString()];
                    objProps79['sourceValue79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['sourceValue79'.toString()];
                    objProps79['toRuleSet79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['toRuleSet79'.toString()];
                    objProps79['targetValue79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['targetValue79'.toString()];
                    objProps79['targetColumn79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['targetColumn79'.toString()];
                    objProps79['fontColor79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['fontColor79'.toString()];
                    objProps79['layout79'.toString()] =
                        this.gridModel.settings.conditionalFormatting3['layout79'.toString()];
                }

                objectEnumeration.push({

                    objectName: options.objectName,
                    properties: objProps79,
                    selector: null
                });

                // tslint:disable-next-line:typedef
                const objProps = {};
                for (let i: number = 79; i <= 100; i++) {
                    if (this.gridModel.settings.conditionalFormatting3[`layout${i}`]) {
                        if ('isBlank' === this.gridModel.settings.conditionalFormatting3[`fromRuleSet${(i + 1).toString()}`]) {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`layout${(i + 1).toString()}`];
                        } else if ('is' === this.gridModel.settings.conditionalFormatting3[`fromRuleSet${(i + 1).toString()}`]) {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`sourceValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`sourceValue${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`layout${(i + 1).toString()}`];
                        } else {
                            objProps[`sourceColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`sourceColumn${(i + 1).toString()}`];
                            objProps[`fromRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`fromRuleSet${(i + 1).toString()}`];
                            objProps[`sourceValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`sourceValue${(i + 1).toString()}`];
                            objProps[`toRuleSet${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`toRuleSet${(i + 1).toString()}`];
                            objProps[`targetValue${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`targetValue${(i + 1).toString()}`];
                            objProps[`targetColumn${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`targetColumn${(i + 1).toString()}`];
                            objProps[`fontColor${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`fontColor${(i + 1).toString()}`];
                            objProps[`layout${(i + 1).toString()}`] =
                                this.gridModel.settings.conditionalFormatting3[`layout${(i + 1).toString()}`];
                        }

                    }
                }

                objectEnumeration.push({
                    objectName: options.objectName,
                    properties: objProps,
                    selector: null
                });

                return objectEnumeration;
            } else if ('gridSettings' === objectName) {

                // tslint:disable-next-line:no-any
                const objProps: any = {};

                objProps[`fontFamily`] = this.gridModel.settings.gridSettings.fontFamily;
                objProps[`fontSize`] = this.gridModel.settings.gridSettings.fontSize;
                objProps.showHierarchy = this.gridModel.settings.gridSettings.showHierarchy;
                objProps.outlineColor = this.gridModel.settings.gridSettings.outlineColor;
                objProps.prefixText = this.gridModel.settings.gridSettings.prefixText;

                objProps.showHierarchy = this.gridModel.settings.gridSettings.showHierarchy;
                objProps[`verticalGrid`] = this.gridModel.settings.gridSettings.verticalGrid;
                if (this.gridModel.settings.gridSettings.verticalGrid) {
                    objProps.verticalGridColor = this.gridModel.settings.gridSettings.verticalGridColor;
                    objProps[`verticalGridThickness`] = this.gridModel.settings.gridSettings.verticalGridThickness;

                }
                objProps[`horizontalGrid`] = this.gridModel.settings.gridSettings.horizontalGrid;

                if (this.gridModel.settings.gridSettings.horizontalGrid) {
                    objProps.horizontalGridColor = this.gridModel.settings.gridSettings.horizontalGridColor;
                    objProps[`horizontalGridThickness`] = this.gridModel.settings.gridSettings.horizontalGridThickness;

                }

                if (this.gridModel.settings.gridSettings.verticalGrid && this.gridModel.settings.gridSettings.horizontalGrid) {
                    objProps.horizontalGridColor = this.gridModel.settings.gridSettings.horizontalGridColor;
                    objProps[`horizontalGridThickness`] = this.gridModel.settings.gridSettings.horizontalGridThickness;
                    objProps.verticalGridColor = this.gridModel.settings.gridSettings.verticalGridColor;
                    objProps[`verticalGridThickness`] = this.gridModel.settings.gridSettings.verticalGridThickness;

                }
                objProps.rowpadding = this.gridModel.settings.gridSettings.rowpadding;

                objProps.displayUnits = this.gridModel.settings.gridSettings.displayUnits;
                objProps.decimalValue = this.gridModel.settings.gridSettings.decimalValue;
                objectEnumeration.push({
                    objectName: options.objectName,
                    properties: objProps,
                    selector: null
                });

                return objectEnumeration;
            }

            return VisualSettings.enumerateObjectInstances(this.gridModel.settings || VisualSettings.getDefault(), options);
        }

    }
}
