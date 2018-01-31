/*
 *  Power BI Visualizations
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

module powerbi.extensibility.visual {
    'use strict';
    import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;

    export class VisualSettings extends DataViewObjectsParser {
      public totalSettings: TotalSettings = new TotalSettings();
      public gridSettings: GridSettings = new GridSettings();
      public columnHeaders: ColumnHeaders = new ColumnHeaders();
     // public valueSettings: ValueSettings=new
      public persistSortSettings: PersistSortSettings = new PersistSortSettings();
      public persistResizeSettings: PersistResizeSettings = new PersistResizeSettings();
      public persistExpandCollapseSettings: PersistExpandCollapseSettings = new PersistExpandCollapseSettings();
      public conditionalFormatting: ConditionalFormatting = new ConditionalFormatting();
      public conditionalFormatting1: ConditionalFormatting1 = new ConditionalFormatting1();
      public conditionalFormatting2: ConditionalFormatting2 = new ConditionalFormatting2();
      public conditionalFormatting3: ConditionalFormatting3 = new ConditionalFormatting3();
      public color: Color = new Color();
    }

    export class Color {
      public show: boolean = true;
      public sourceColumn1: string = '';
      public backgroundColor1: string = '#AFB5B6';
      public fontColor1: string = '#000';
      public alignment1: string = 'Auto';
      public sourceColumn2: string = '';
      public backgroundColor2: string = '#AFB5B6';
      public fontColor2: string = '#000';
      public alignment2: string = 'Auto';
      public sourceColumn3: string = '';
      public backgroundColor3: string = '#AFB5B6';
      public fontColor3: string = '#000';
      public alignment3: string = 'Auto';
      public sourceColumn4: string = '';
      public backgroundColor4: string = '#AFB5B6';
      public fontColor4: string = '#000';
      public alignment4: string = 'Auto';
      public sourceColumn5: string = '';
      public backgroundColor5: string = '#AFB5B6';
      public fontColor5: string = '#000';
      public alignment5: string = 'Auto';
      public sourceColumn6: string = '';
      public backgroundColor6: string = '#AFB5B6';
      public fontColor6: string = '#000';
      public alignment6: string = 'Auto';
      public sourceColumn7: string = '';
      public backgroundColor7: string = '#AFB5B6';
      public fontColor7: string = '#000';
      public alignment7: string = 'Auto';
      public sourceColumn8: string = '';
      public backgroundColor8: string = '#AFB5B6';
      public fontColor8: string = '#000';
      public alignment8: string = 'Auto';
      public sourceColumn9: string = '';
      public backgroundColor9: string = '#AFB5B6';
      public fontColor9: string = '#000';
      public alignment9: string = 'Auto';
      public sourceColumn10: string = '';
      public backgroundColor10: string = '#AFB5B6';
      public fontColor10: string = '#000';
      public alignment10: string = 'Auto';
      public sourceColumn11: string = '';
      public backgroundColor11: string = '#AFB5B6';
      public fontColor11: string = '#000';
      public alignment11: string = 'Auto';
      public sourceColumn12: string = '';
      public backgroundColor12: string = '#AFB5B6';
      public fontColor12: string = '#000';
      public alignment12: string = 'Auto';
      public sourceColumn13: string = '';
      public backgroundColor13: string = '#AFB5B6';
      public fontColor13: string = '#000';
      public alignment13: string = 'Auto';
      public sourceColumn14: string = '';
      public backgroundColor14: string = '#AFB5B6';
      public fontColor14: string = '#000';
      public alignment14: string = 'Auto';
      public sourceColumn15: string = '';
      public backgroundColor15: string = '#AFB5B6';
      public fontColor15: string = '#000';
      public alignment15: string = 'Auto';
      public sourceColumn16: string = '';
      public backgroundColor16: string = '#AFB5B6';
      public fontColor16: string = '#000';
      public alignment16: string = 'Auto';
      public sourceColumn17: string = '';
      public backgroundColor17: string = '#AFB5B6';
      public fontColor17: string = '#000';
      public alignment17: string = 'Auto';
      public sourceColumn18: string = '';
      public backgroundColor18: string = '#AFB5B6';
      public fontColor18: string = '#000';
      public alignment18: string = 'Auto';
      public sourceColumn19: string = '';
      public backgroundColor19: string = '#AFB5B6';
      public fontColor19: string = '#000';
      public alignment19: string = 'Auto';
      public sourceColumn20: string = '';
      public backgroundColor20: string = '#AFB5B6';
      public fontColor20: string = '#000';
      public alignment20: string = 'Auto';
      public sourceColumn21: string = '';
      public backgroundColor21: string = '#AFB5B6';
      public fontColor21: string = '#000';
      public alignment21: string = 'Auto';
      public sourceColumn22: string = '';
      public backgroundColor22: string = '#AFB5B6';
      public fontColor22: string = '#000';
      public alignment22: string = 'Auto';
      public sourceColumn23: string = '';
      public backgroundColor23: string = '#AFB5B6';
      public fontColor23: string = '#000';
      public alignment23: string = 'Auto';
      public sourceColumn24: string = '';
      public backgroundColor24: string = '#AFB5B6';
      public fontColor24: string = '#000';
      public alignment24: string = 'Auto';
      public sourceColumn25: string = '';
      public backgroundColor25: string = '#AFB5B6';
      public fontColor25: string = '#000';
      public alignment25: string = 'Auto';
      public sourceColumn26: string = '';
      public backgroundColor26: string = '#AFB5B6';
      public fontColor26: string = '#000';
      public alignment26: string = 'Auto';
      public sourceColumn27: string = '';
      public backgroundColor27: string = '#AFB5B6';
      public fontColor27: string = '#000';
      public alignment27: string = 'Auto';
      public sourceColumn28: string = '';
      public backgroundColor28: string = '#AFB5B6';
      public fontColor28: string = '#000';
      public alignment28: string = 'Auto';
      public sourceColumn29: string = '';
      public backgroundColor29: string = '#AFB5B6';
      public fontColor29: string = '#000';
      public alignment29: string = 'Auto';
      public sourceColumn30: string = '';
      public backgroundColor30: string = '#AFB5B6';
      public fontColor30: string = '#000';
      public alignment30: string = 'Auto';
      public sourceColumn31: string = '';
      public backgroundColor31: string = '#AFB5B6';
      public fontColor31: string = '#000';
      public alignment31: string = 'Auto';
      public sourceColumn32: string = '';
      public backgroundColor32: string = '#AFB5B6';
      public fontColor32: string = '#000';
      public alignment32: string = 'Auto';
      public sourceColumn33: string = '';
      public backgroundColor33: string = '#AFB5B6';
      public fontColor33: string = '#000';
      public alignment33: string = 'Auto';
      public sourceColumn34: string = '';
      public backgroundColor34: string = '#AFB5B6';
      public fontColor34: string = '#000';
      public alignment34: string = 'Auto';
      public sourceColumn35: string = '';
      public backgroundColor35: string = '#AFB5B6';
      public fontColor35: string = '#000';
      public alignment35: string = 'Auto';
      public sourceColumn36: string = '';
      public backgroundColor36: string = '#AFB5B6';
      public fontColor36: string = '#000';
      public alignment36: string = 'Auto';
    }

    export class ConditionalFormatting {

      public sourceColumn: string = '';
      public fromRuleSet: string = 'isGreaterThan';
      public sourceValue: string = '';
      public toRuleSet: string = 'isLessThan';
      public targetValue: string = '';
      public targetColumn: string = '';
      public fontColor: string = '#000';
      public layout: boolean = false;

      public sourceColumn1: string = '';
      public fromRuleSet1: string = 'isGreaterThan';
      public sourceValue1: string = '';
      public toRuleSet1: string = 'isLessThan';
      public targetValue1: string = '';
      public targetColumn1: string = '';
      public fontColor1: string = '#000';
      public layout1: boolean = false;

      public sourceColumn2: string = '';
      public fromRuleSet2: string = 'isGreaterThan';
      public sourceValue2: string = '';
      public toRuleSet2: string = 'isLessThan';
      public targetValue2: string = '';
      public targetColumn2: string = '';
      public fontColor2: string = '#000';
      public layout2: boolean = false;

      public sourceColumn3: string = '';
      public fromRuleSet3: string = 'isGreaterThan';
      public sourceValue3: string = '';
      public toRuleSet3: string = 'isLessThan';
      public targetValue3: string = '';
      public targetColumn3: string = '';
      public fontColor3: string = '#000';
      public layout3: boolean = false;

      public sourceColumn4: string = '';
      public fromRuleSet4: string = 'isGreaterThan';
      public sourceValue4: string = '';
      public toRuleSet4: string = 'isLessThan';
      public targetValue4: string = '';
      public targetColumn4: string = '';
      public fontColor4: string = '#000';
      public layout4: boolean = false;

      public sourceColumn5: string = '';
      public fromRuleSet5: string = 'isGreaterThan';
      public sourceValue5: string = '';
      public toRuleSet5: string = 'isLessThan';
      public targetValue5: string = '';
      public targetColumn5: string = '';
      public fontColor5: string = '#000';
      public layout5: boolean = false;

      public sourceColumn6: string = '';
      public fromRuleSet6: string = 'isGreaterThan';
      public sourceValue6: string = '';
      public toRuleSet6: string = 'isLessThan';
      public targetValue6: string = '';
      public targetColumn6: string = '';
      public fontColor6: string = '#000';
      public layout6: boolean = false;

      public sourceColumn7: string = '';
      public fromRuleSet7: string = 'isGreaterThan';
      public sourceValue7: string = '';
      public toRuleSet7: string = 'isLessThan';
      public targetValue7: string = '';
      public targetColumn7: string = '';
      public fontColor7: string = '#000';
      public layout7: boolean = false;

      public sourceColumn8: string = '';
      public fromRuleSet8: string = 'isGreaterThan';
      public sourceValue8: string = '';
      public toRuleSet8: string = 'isLessThan';
      public targetValue8: string = '';
      public targetColumn8: string = '';
      public fontColor8: string = '#000';
      public layout8: boolean = false;

      public sourceColumn9: string = '';
      public fromRuleSet9: string = 'isGreaterThan';
      public sourceValue9: string = '';
      public toRuleSet9: string = 'isLessThan';
      public targetValue9: string = '';
      public targetColumn9: string = '';
      public fontColor9: string = '#000';
      public layout9: boolean = false;

      public sourceColumn10: string = '';
      public fromRuleSet10: string = 'isGreaterThan';
      public sourceValue10: string = '';
      public toRuleSet10: string = 'isLessThan';
      public targetValue10: string = '';
      public targetColumn10: string = '';
      public fontColor10: string = '#000';
      public layout10: boolean = false;

      public sourceColumn11: string = '';
      public fromRuleSet11: string = 'isGreaterThan';
      public sourceValue11: string = '';
      public toRuleSet11: string = 'isLessThan';
      public targetValue11: string = '';
      public targetColumn11: string = '';
      public fontColor11: string = '#000';
      public layout11: boolean = false;

      public sourceColumn12: string = '';
      public fromRuleSet12: string = 'isGreaterThan';
      public sourceValue12: string = '';
      public toRuleSet12: string = 'isLessThan';
      public targetValue12: string = '';
      public targetColumn12: string = '';
      public fontColor12: string = '#000';
      public layout12: boolean = false;

      public sourceColumn13: string = '';
      public fromRuleSet13: string = 'isGreaterThan';
      public sourceValue13: string = '';
      public toRuleSet13: string = 'isLessThan';
      public targetValue13: string = '';
      public targetColumn13: string = '';
      public fontColor13: string = '#000';
      public layout13: boolean = false;

      public sourceColumn14: string = '';
      public fromRuleSet14: string = 'isGreaterThan';
      public sourceValue14: string = '';
      public toRuleSet14: string = 'isLessThan';
      public targetValue14: string = '';
      public targetColumn14: string = '';
      public fontColor14: string = '#000';
      public layout14: boolean = false;

      public sourceColumn15: string = '';
      public fromRuleSet15: string = 'isGreaterThan';
      public sourceValue15: string = '';
      public toRuleSet15: string = 'isLessThan';
      public targetValue15: string = '';
      public targetColumn15: string = '';
      public fontColor15: string = '#000';
      public layout15: boolean = false;

      public sourceColumn16: string = '';
      public fromRuleSet16: string = 'isGreaterThan';
      public sourceValue16: string = '';
      public toRuleSet16: string = 'isLessThan';
      public targetValue16: string = '';
      public targetColumn16: string = '';
      public fontColor16: string = '#000';
      public layout16: boolean = false;

      public sourceColumn17: string = '';
      public fromRuleSet17: string = 'isGreaterThan';
      public sourceValue17: string = '';
      public toRuleSet17: string = 'isLessThan';
      public targetValue17: string = '';
      public targetColumn17: string = '';
      public fontColor17: string = '#000';
      public layout17: boolean = false;

      public sourceColumn18: string = '';
      public fromRuleSet18: string = 'isGreaterThan';
      public sourceValue18: string = '';
      public toRuleSet18: string = 'isLessThan';
      public targetValue18: string = '';
      public targetColumn18: string = '';
      public fontColor18: string = '#000';
      public layout18: boolean = false;

      public sourceColumn19: string = '';
      public fromRuleSet19: string = 'isGreaterThan';
      public sourceValue19: string = '';
      public toRuleSet19: string = 'isLessThan';
      public targetValue19: string = '';
      public targetColumn19: string = '';
      public fontColor19: string = '#000';
      public layout19: boolean = false;

      public sourceColumn20: string = '';
      public fromRuleSet20: string = 'isGreaterThan';
      public sourceValue20: string = '';
      public toRuleSet20: string = 'isLessThan';
      public targetValue20: string = '';
      public targetColumn20: string = '';
      public fontColor20: string = '#000';
      public layout20: boolean = false;

      public sourceColumn21: string = '';
      public fromRuleSet21: string = 'isGreaterThan';
      public sourceValue21: string = '';
      public toRuleSet21: string = 'isLessThan';
      public targetValue21: string = '';
      public targetColumn21: string = '';
      public fontColor21: string = '#000';
      public layout21: boolean = false;

      public sourceColumn22: string = '';
      public fromRuleSet22: string = 'isGreaterThan';
      public sourceValue22: string = '';
      public toRuleSet22: string = 'isLessThan';
      public targetValue22: string = '';
      public targetColumn22: string = '';
      public fontColor22: string = '#000';
      public layout22: boolean = false;

      public sourceColumn23: string = '';
      public fromRuleSet23: string = 'isGreaterThan';
      public sourceValue23: string = '';
      public toRuleSet23: string = 'isLessThan';
      public targetValue23: string = '';
      public targetColumn23: string = '';
      public fontColor23: string = '#000';
      public layout23: boolean = false;

      public sourceColumn24: string = '';
      public fromRuleSet24: string = 'isGreaterThan';
      public sourceValue24: string = '';
      public toRuleSet24: string = 'isLessThan';
      public targetValue24: string = '';
      public targetColumn24: string = '';
      public fontColor24: string = '#000';
      public layout24: boolean = false;

      public sourceColumn25: string = '';
      public fromRuleSet25: string = 'isGreaterThan';
      public sourceValue25: string = '';
      public toRuleSet25: string = 'isLessThan';
      public targetValue25: string = '';
      public targetColumn25: string = '';
      public fontColor25: string = '#000';
      public layout25: boolean = false;

      public sourceColumn26: string = '';
      public fromRuleSet26: string = 'isGreaterThan';
      public sourceValue26: string = '';
      public toRuleSet26: string = 'isLessThan';
      public targetValue26: string = '';
      public targetColumn26: string = '';
      public fontColor26: string = '#000';
      public layout26: boolean = false;
    }

    // tslint:disable-next-line:max-classes-per-file
    export class ConditionalFormatting1 {
      public show: boolean = false;
      public sourceColumn27: string = '';
      public fromRuleSet27: string = 'isGreaterThan';
      public sourceValue27: string = '';
      public toRuleSet27: string = 'isLessThan';
      public targetValue27: string = '';
      public targetColumn27: string = '';
      public fontColor27: string = '#000';
      public layout27: boolean = false;

      public sourceColumn28: string = '';
      public fromRuleSet28: string = 'isGreaterThan';
      public sourceValue28: string = '';
      public toRuleSet28: string = 'isLessThan';
      public targetValue28: string = '';
      public targetColumn28: string = '';
      public fontColor28: string = '#000';
      public layout28: boolean = false;

      public sourceColumn29: string = '';
      public fromRuleSet29: string = 'isGreaterThan';
      public sourceValue29: string = '';
      public toRuleSet29: string = 'isLessThan';
      public targetValue29: string = '';
      public targetColumn29: string = '';
      public fontColor29: string = '#000';
      public layout29: boolean = false;

      public sourceColumn30: string = '';
      public fromRuleSet30: string = 'isGreaterThan';
      public sourceValue30: string = '';
      public toRuleSet30: string = 'isLessThan';
      public targetValue30: string = '';
      public targetColumn30: string = '';
      public fontColor30: string = '#000';
      public layout30: boolean = false;

      public sourceColumn31: string = '';
      public fromRuleSet31: string = 'isGreaterThan';
      public sourceValue31: string = '';
      public toRuleSet31: string = 'isLessThan';
      public targetValue31: string = '';
      public targetColumn31: string = '';
      public fontColor31: string = '#000';
      public layout31: boolean = false;

      public sourceColumn32: string = '';
      public fromRuleSet32: string = 'isGreaterThan';
      public sourceValue32: string = '';
      public toRuleSet32: string = 'isLessThan';
      public targetValue32: string = '';
      public targetColumn32: string = '';
      public fontColor32: string = '#000';
      public layout32: boolean = false;

      public sourceColumn33: string = '';
      public fromRuleSet33: string = 'isGreaterThan';
      public sourceValue33: string = '';
      public toRuleSet33: string = 'isLessThan';
      public targetValue33: string = '';
      public targetColumn33: string = '';
      public fontColor33: string = '#000';
      public layout33: boolean = false;

      public sourceColumn34: string = '';
      public fromRuleSet34: string = 'isGreaterThan';
      public sourceValue34: string = '';
      public toRuleSet34: string = 'isLessThan';
      public targetValue34: string = '';
      public targetColumn34: string = '';
      public fontColor34: string = '#000';
      public layout34: boolean = false;

      public sourceColumn35: string = '';
      public fromRuleSet35: string = 'isGreaterThan';
      public sourceValue35: string = '';
      public toRuleSet35: string = 'isLessThan';
      public targetValue35: string = '';
      public targetColumn35: string = '';
      public fontColor35: string = '#000';
      public layout35: boolean = false;

      public sourceColumn36: string = '';
      public fromRuleSet36: string = 'isGreaterThan';
      public sourceValue36: string = '';
      public toRuleSet36: string = 'isLessThan';
      public targetValue36: string = '';
      public targetColumn36: string = '';
      public fontColor36: string = '#000';
      public layout36: boolean = false;

      public sourceColumn37: string = '';
      public fromRuleSet37: string = 'isGreaterThan';
      public sourceValue37: string = '';
      public toRuleSet37: string = 'isLessThan';
      public targetValue37: string = '';
      public targetColumn37: string = '';
      public fontColor37: string = '#000';
      public layout37: boolean = false;

      public sourceColumn38: string = '';
      public fromRuleSet38: string = 'isGreaterThan';
      public sourceValue38: string = '';
      public toRuleSet38: string = 'isLessThan';
      public targetValue38: string = '';
      public targetColumn38: string = '';
      public fontColor38: string = '#000';
      public layout38: boolean = false;

      public sourceColumn39: string = '';
      public fromRuleSet39: string = 'isGreaterThan';
      public sourceValue39: string = '';
      public toRuleSet39: string = 'isLessThan';
      public targetValue39: string = '';
      public targetColumn39: string = '';
      public fontColor39: string = '#000';
      public layout39: boolean = false;

      public sourceColumn40: string = '';
      public fromRuleSet40: string = 'isGreaterThan';
      public sourceValue40: string = '';
      public toRuleSet40: string = 'isLessThan';
      public targetValue40: string = '';
      public targetColumn40: string = '';
      public fontColor40: string = '#000';
      public layout40: boolean = false;

      public sourceColumn41: string = '';
      public fromRuleSet41: string = 'isGreaterThan';
      public sourceValue41: string = '';
      public toRuleSet41: string = 'isLessThan';
      public targetValue41: string = '';
      public targetColumn41: string = '';
      public fontColor41: string = '#000';
      public layout41: boolean = false;

      public sourceColumn42: string = '';
      public fromRuleSet42: string = 'isGreaterThan';
      public sourceValue42: string = '';
      public toRuleSet42: string = 'isLessThan';
      public targetValue42: string = '';
      public targetColumn42: string = '';
      public fontColor42: string = '#000';
      public layout42: boolean = false;

      public sourceColumn43: string = '';
      public fromRuleSet43: string = 'isGreaterThan';
      public sourceValue43: string = '';
      public toRuleSet43: string = 'isLessThan';
      public targetValue43: string = '';
      public targetColumn43: string = '';
      public fontColor43: string = '#000';
      public layout43: boolean = false;

      public sourceColumn44: string = '';
      public fromRuleSet44: string = 'isGreaterThan';
      public sourceValue44: string = '';
      public toRuleSet44: string = 'isLessThan';
      public targetValue44: string = '';
      public targetColumn44: string = '';
      public fontColor44: string = '#000';
      public layout44: boolean = false;

      public sourceColumn45: string = '';
      public fromRuleSet45: string = 'isGreaterThan';
      public sourceValue45: string = '';
      public toRuleSet45: string = 'isLessThan';
      public targetValue45: string = '';
      public targetColumn45: string = '';
      public fontColor45: string = '#000';
      public layout45: boolean = false;

      public sourceColumn46: string = '';
      public fromRuleSet46: string = 'isGreaterThan';
      public sourceValue46: string = '';
      public toRuleSet46: string = 'isLessThan';
      public targetValue46: string = '';
      public targetColumn46: string = '';
      public fontColor46: string = '#000';
      public layout46: boolean = false;

      public sourceColumn47: string = '';
      public fromRuleSet47: string = 'isGreaterThan';
      public sourceValue47: string = '';
      public toRuleSet47: string = 'isLessThan';
      public targetValue47: string = '';
      public targetColumn47: string = '';
      public fontColor47: string = '#000';
      public layout47: boolean = false;

      public sourceColumn48: string = '';
      public fromRuleSet48: string = 'isGreaterThan';
      public sourceValue48: string = '';
      public toRuleSet48: string = 'isLessThan';
      public targetValue48: string = '';
      public targetColumn48: string = '';
      public fontColor48: string = '#000';
      public layout48: boolean = false;

      public sourceColumn49: string = '';
      public fromRuleSet49: string = 'isGreaterThan';
      public sourceValue49: string = '';
      public toRuleSet49: string = 'isLessThan';
      public targetValue49: string = '';
      public targetColumn49: string = '';
      public fontColor49: string = '#000';
      public layout49: boolean = false;

      public sourceColumn50: string = '';
      public fromRuleSet50: string = 'isGreaterThan';
      public sourceValue50: string = '';
      public toRuleSet50: string = 'isLessThan';
      public targetValue50: string = '';
      public targetColumn50: string = '';
      public fontColor50: string = '#000';
      public layout50: boolean = false;

      public sourceColumn51: string = '';
      public fromRuleSet51: string = 'isGreaterThan';
      public sourceValue51: string = '';
      public toRuleSet51: string = 'isLessThan';
      public targetValue51: string = '';
      public targetColumn51: string = '';
      public fontColor51: string = '#000';
      public layout51: boolean = false;

      public sourceColumn52: string = '';
      public fromRuleSet52: string = 'isGreaterThan';
      public sourceValue52: string = '';
      public toRuleSet52: string = 'isLessThan';
      public targetValue52: string = '';
      public targetColumn52: string = '';
      public fontColor52: string = '#000';
      public layout52: boolean = false;
    }

    // tslint:disable-next-line:max-classes-per-file
    export class ConditionalFormatting2 {
      public show: boolean = false;
      public sourceColumn53: string = '';
      public fromRuleSet53: string = 'isGreaterThan';
      public sourceValue53: string = '';
      public toRuleSet53: string = 'isLessThan';
      public targetValue53: string = '';
      public targetColumn53: string = '';
      public fontColor53: string = '#000';
      public layout53: boolean = false;

      public sourceColumn54: string = '';
      public fromRuleSet54: string = 'isGreaterThan';
      public sourceValue54: string = '';
      public toRuleSet54: string = 'isLessThan';
      public targetValue54: string = '';
      public targetColumn54: string = '';
      public fontColor54: string = '#000';
      public layout54: boolean = false;

      public sourceColumn55: string = '';
      public fromRuleSet55: string = 'isGreaterThan';
      public sourceValue55: string = '';
      public toRuleSet55: string = 'isLessThan';
      public targetValue55: string = '';
      public targetColumn55: string = '';
      public fontColor55: string = '#000';
      public layout55: boolean = false;

      public sourceColumn56: string = '';
      public fromRuleSet56: string = 'isGreaterThan';
      public sourceValue56: string = '';
      public toRuleSet56: string = 'isLessThan';
      public targetValue56: string = '';
      public targetColumn56: string = '';
      public fontColor56: string = '#000';
      public layout56: boolean = false;

      public sourceColumn57: string = '';
      public fromRuleSet57: string = 'isGreaterThan';
      public sourceValue57: string = '';
      public toRuleSet57: string = 'isLessThan';
      public targetValue57: string = '';
      public targetColumn57: string = '';
      public fontColor57: string = '#000';
      public layout57: boolean = false;

      public sourceColumn58: string = '';
      public fromRuleSet58: string = 'isGreaterThan';
      public sourceValue58: string = '';
      public toRuleSet58: string = 'isLessThan';
      public targetValue58: string = '';
      public targetColumn58: string = '';
      public fontColor58: string = '#000';
      public layout58: boolean = false;

      public sourceColumn59: string = '';
      public fromRuleSet59: string = 'isGreaterThan';
      public sourceValue59: string = '';
      public toRuleSet59: string = 'isLessThan';
      public targetValue59: string = '';
      public targetColumn59: string = '';
      public fontColor59: string = '#000';
      public layout59: boolean = false;

      public sourceColumn60: string = '';
      public fromRuleSet60: string = 'isGreaterThan';
      public sourceValue60: string = '';
      public toRuleSet60: string = 'isLessThan';
      public targetValue60: string = '';
      public targetColumn60: string = '';
      public fontColor60: string = '#000';
      public layout60: boolean = false;

      public sourceColumn61: string = '';
      public fromRuleSet61: string = 'isGreaterThan';
      public sourceValue61: string = '';
      public toRuleSet61: string = 'isLessThan';
      public targetValue61: string = '';
      public targetColumn61: string = '';
      public fontColor61: string = '#000';
      public layout61: boolean = false;

      public sourceColumn62: string = '';
      public fromRuleSet62: string = 'isGreaterThan';
      public sourceValue62: string = '';
      public toRuleSet62: string = 'isLessThan';
      public targetValue62: string = '';
      public targetColumn62: string = '';
      public fontColor62: string = '#000';
      public layout62: boolean = false;

      public sourceColumn63: string = '';
      public fromRuleSet63: string = 'isGreaterThan';
      public sourceValue63: string = '';
      public toRuleSet63: string = 'isLessThan';
      public targetValue63: string = '';
      public targetColumn63: string = '';
      public fontColor63: string = '#000';
      public layout63: boolean = false;

      public sourceColumn64: string = '';
      public fromRuleSet64: string = 'isGreaterThan';
      public sourceValue64: string = '';
      public toRuleSet64: string = 'isLessThan';
      public targetValue64: string = '';
      public targetColumn64: string = '';
      public fontColor64: string = '#000';
      public layout64: boolean = false;

      public sourceColumn65: string = '';
      public fromRuleSet65: string = 'isGreaterThan';
      public sourceValue65: string = '';
      public toRuleSet65: string = 'isLessThan';
      public targetValue65: string = '';
      public targetColumn65: string = '';
      public fontColor65: string = '#000';
      public layout65: boolean = false;

      public sourceColumn66: string = '';
      public fromRuleSet66: string = 'isGreaterThan';
      public sourceValue66: string = '';
      public toRuleSet66: string = 'isLessThan';
      public targetValue66: string = '';
      public targetColumn66: string = '';
      public fontColor66: string = '#000';
      public layout66: boolean = false;

      public sourceColumn67: string = '';
      public fromRuleSet67: string = 'isGreaterThan';
      public sourceValue67: string = '';
      public toRuleSet67: string = 'isLessThan';
      public targetValue67: string = '';
      public targetColumn67: string = '';
      public fontColor67: string = '#000';
      public layout67: boolean = false;

      public sourceColumn68: string = '';
      public fromRuleSet68: string = 'isGreaterThan';
      public sourceValue68: string = '';
      public toRuleSet68: string = 'isLessThan';
      public targetValue68: string = '';
      public targetColumn68: string = '';
      public fontColor68: string = '#000';
      public layout68: boolean = false;

      public sourceColumn69: string = '';
      public fromRuleSet69: string = 'isGreaterThan';
      public sourceValue69: string = '';
      public toRuleSet69: string = 'isLessThan';
      public targetValue69: string = '';
      public targetColumn69: string = '';
      public fontColor69: string = '#000';
      public layout69: boolean = false;

      public sourceColumn70: string = '';
      public fromRuleSet70: string = 'isGreaterThan';
      public sourceValue70: string = '';
      public toRuleSet70: string = 'isLessThan';
      public targetValue70: string = '';
      public targetColumn70: string = '';
      public fontColor70: string = '#000';
      public layout70: boolean = false;

      public sourceColumn71: string = '';
      public fromRuleSet71: string = 'isGreaterThan';
      public sourceValue71: string = '';
      public toRuleSet71: string = 'isLessThan';
      public targetValue71: string = '';
      public targetColumn71: string = '';
      public fontColor71: string = '#000';
      public layout71: boolean = false;

      public sourceColumn72: string = '';
      public fromRuleSet72: string = 'isGreaterThan';
      public sourceValue72: string = '';
      public toRuleSet72: string = 'isLessThan';
      public targetValue72: string = '';
      public targetColumn72: string = '';
      public fontColor72: string = '#000';
      public layout72: boolean = false;

      public sourceColumn73: string = '';
      public fromRuleSet73: string = 'isGreaterThan';
      public sourceValue73: string = '';
      public toRuleSet73: string = 'isLessThan';
      public targetValue73: string = '';
      public targetColumn73: string = '';
      public fontColor73: string = '#000';
      public layout73: boolean = false;

      public sourceColumn74: string = '';
      public fromRuleSet74: string = 'isGreaterThan';
      public sourceValue74: string = '';
      public toRuleSet74: string = 'isLessThan';
      public targetValue74: string = '';
      public targetColumn74: string = '';
      public fontColor74: string = '#000';
      public layout74: boolean = false;

      public sourceColumn75: string = '';
      public fromRuleSet75: string = 'isGreaterThan';
      public sourceValue75: string = '';
      public toRuleSet75: string = 'isLessThan';
      public targetValue75: string = '';
      public targetColumn75: string = '';
      public fontColor75: string = '#000';
      public layout75: boolean = false;

      public sourceColumn76: string = '';
      public fromRuleSet76: string = 'isGreaterThan';
      public sourceValue76: string = '';
      public toRuleSet76: string = 'isLessThan';
      public targetValue76: string = '';
      public targetColumn76: string = '';
      public fontColor76: string = '#000';
      public layout76: boolean = false;

      public sourceColumn77: string = '';
      public fromRuleSet77: string = 'isGreaterThan';
      public sourceValue77: string = '';
      public toRuleSet77: string = 'isLessThan';
      public targetValue77: string = '';
      public targetColumn77: string = '';
      public fontColor77: string = '#000';
      public layout77: boolean = false;

      public sourceColumn78: string = '';
      public fromRuleSet78: string = 'isGreaterThan';
      public sourceValue78: string = '';
      public toRuleSet78: string = 'isLessThan';
      public targetValue78: string = '';
      public targetColumn78: string = '';
      public fontColor78: string = '#000';
      public layout78: boolean = false;
    }

    // tslint:disable-next-line:max-classes-per-file
    export class ConditionalFormatting3 {
      public show: boolean = false;

      public sourceColumn79: string = '';
      public fromRuleSet79: string = 'isGreaterThan';
      public sourceValue79: string = '';
      public toRuleSet79: string = 'isLessThan';
      public targetValue79: string = '';
      public targetColumn79: string = '';
      public fontColor79: string = '#000';
      public layout79: boolean = false;

      public sourceColumn80: string = '';
      public fromRuleSet80: string = 'isGreaterThan';
      public sourceValue80: string = '';
      public toRuleSet80: string = 'isLessThan';
      public targetValue80: string = '';
      public targetColumn80: string = '';
      public fontColor80: string = '#000';
      public layout80: boolean = false;

      public sourceColumn81: string = '';
      public fromRuleSet81: string = 'isGreaterThan';
      public sourceValue81: string = '';
      public toRuleSet81: string = 'isLessThan';
      public targetValue81: string = '';
      public targetColumn81: string = '';
      public fontColor81: string = '#000';
      public layout81: boolean = false;

      public sourceColumn82: string = '';
      public fromRuleSet82: string = 'isGreaterThan';
      public sourceValue82: string = '';
      public toRuleSet82: string = 'isLessThan';
      public targetValue82: string = '';
      public targetColumn82: string = '';
      public fontColor82: string = '#000';
      public layout82: boolean = false;

      public sourceColumn83: string = '';
      public fromRuleSet83: string = 'isGreaterThan';
      public sourceValue83: string = '';
      public toRuleSet83: string = 'isLessThan';
      public targetValue83: string = '';
      public targetColumn83: string = '';
      public fontColor83: string = '#000';
      public layout83: boolean = false;

      public sourceColumn84: string = '';
      public fromRuleSet84: string = 'isGreaterThan';
      public sourceValue84: string = '';
      public toRuleSet84: string = 'isLessThan';
      public targetValue84: string = '';
      public targetColumn84: string = '';
      public fontColor84: string = '#000';
      public layout84: boolean = false;

      public sourceColumn85: string = '';
      public fromRuleSet85: string = 'isGreaterThan';
      public sourceValue85: string = '';
      public toRuleSet85: string = 'isLessThan';
      public targetValue85: string = '';
      public targetColumn85: string = '';
      public fontColor85: string = '#000';
      public layout85: boolean = false;

      public sourceColumn86: string = '';
      public fromRuleSet86: string = 'isGreaterThan';
      public sourceValue86: string = '';
      public toRuleSet86: string = 'isLessThan';
      public targetValue86: string = '';
      public targetColumn86: string = '';
      public fontColor86: string = '#000';
      public layout86: boolean = false;

      public sourceColumn87: string = '';
      public fromRuleSet87: string = 'isGreaterThan';
      public sourceValue87: string = '';
      public toRuleSet87: string = 'isLessThan';
      public targetValue87: string = '';
      public targetColumn87: string = '';
      public fontColor87: string = '#000';
      public layout87: boolean = false;

      public sourceColumn88: string = '';
      public fromRuleSet88: string = 'isGreaterThan';
      public sourceValue88: string = '';
      public toRuleSet88: string = 'isLessThan';
      public targetValue88: string = '';
      public targetColumn88: string = '';
      public fontColor88: string = '#000';
      public layout88: boolean = false;

      public sourceColumn89: string = '';
      public fromRuleSet89: string = 'isGreaterThan';
      public sourceValue89: string = '';
      public toRuleSet89: string = 'isLessThan';
      public targetValue89: string = '';
      public targetColumn89: string = '';
      public fontColor89: string = '#000';
      public layout89: boolean = false;

      public sourceColumn90: string = '';
      public fromRuleSet90: string = 'isGreaterThan';
      public sourceValue90: string = '';
      public toRuleSet90: string = 'isLessThan';
      public targetValue90: string = '';
      public targetColumn90: string = '';
      public fontColor90: string = '#000';
      public layout90: boolean = false;

      public sourceColumn91: string = '';
      public fromRuleSet91: string = 'isGreaterThan';
      public sourceValue91: string = '';
      public toRuleSet91: string = 'isLessThan';
      public targetValue91: string = '';
      public targetColumn91: string = '';
      public fontColor91: string = '#000';
      public layout91: boolean = false;

      public sourceColumn92: string = '';
      public fromRuleSet92: string = 'isGreaterThan';
      public sourceValue92: string = '';
      public toRuleSet92: string = 'isLessThan';
      public targetValue92: string = '';
      public targetColumn92: string = '';
      public fontColor92: string = '#000';
      public layout92: boolean = false;

      public sourceColumn93: string = '';
      public fromRuleSet93: string = 'isGreaterThan';
      public sourceValue93: string = '';
      public toRuleSet93: string = 'isLessThan';
      public targetValue93: string = '';
      public targetColumn93: string = '';
      public fontColor93: string = '#000';
      public layout93: boolean = false;

      public sourceColumn94: string = '';
      public fromRuleSet94: string = 'isGreaterThan';
      public sourceValue94: string = '';
      public toRuleSet94: string = 'isLessThan';
      public targetValue94: string = '';
      public targetColumn94: string = '';
      public fontColor94: string = '#000';
      public layout94: boolean = false;

      public sourceColumn95: string = '';
      public fromRuleSet95: string = 'isGreaterThan';
      public sourceValue95: string = '';
      public toRuleSet95: string = 'isLessThan';
      public targetValue95: string = '';
      public targetColumn95: string = '';
      public fontColor95: string = '#000';
      public layout95: boolean = false;

      public sourceColumn96: string = '';
      public fromRuleSet96: string = 'isGreaterThan';
      public sourceValue96: string = '';
      public toRuleSet96: string = 'isLessThan';
      public targetValue96: string = '';
      public targetColumn96: string = '';
      public fontColor96: string = '#000';
      public layout96: boolean = false;

      public sourceColumn97: string = '';
      public fromRuleSet97: string = 'isGreaterThan';
      public sourceValue97: string = '';
      public toRuleSet97: string = 'isLessThan';
      public targetValue97: string = '';
      public targetColumn97: string = '';
      public fontColor97: string = '#000';
      public layout97: boolean = false;

      public sourceColumn98: string = '';
      public fromRuleSet98: string = 'isGreaterThan';
      public sourceValue98: string = '';
      public toRuleSet98: string = 'isLessThan';
      public targetValue98: string = '';
      public targetColumn98: string = '';
      public fontColor98: string = '#000';
      public layout98: boolean = false;

      public sourceColumn99: string = '';
      public fromRuleSet99: string = 'isGreaterThan';
      public sourceValue99: string = '';
      public toRuleSet99: string = 'isLessThan';
      public targetValue99: string = '';
      public targetColumn99: string = '';
      public fontColor99: string = '#000';
      public layout99: boolean = false;

      public sourceColumn100: string = '';
      public fromRuleSet100: string = 'isGreaterThan';
      public sourceValue100: string = '';
      public toRuleSet100: string = 'isLessThan';
      public targetValue100: string = '';
      public targetColumn100: string = '';
      public fontColor100: string = '#000';
      public layout100: boolean = false;
    }

    // tslint:disable-next-line:max-classes-per-file
    export class TotalSettings {
      public show: boolean = true;
      public fontColor: string = '#000';
      public backgroundColor: string = '#fff';
      public outline: string = 'border-top';
    }

    // tslint:disable-next-line:max-classes-per-file
    export class TableStyle {
      public style: string = 'none';
    }

    // tslint:disable-next-line:max-classes-per-file
    export class GridSettings {
      public fontFamily: string = 'Segoe UI';
      public fontSize: number = 12;
      public showHierarchy: boolean  = false;
      public outlineColor: string = '#CCCCCC';
      public prefixText: string = 'prev_';
      public fixedFooter: boolean = false;
      public fixedHeader: boolean = false;
      public verticalGrid: boolean = false;
      public horizontalGrid: boolean = true;
      public horizontalGridThickness: number = 1;
      public horizontalGridColor: string= '#CCCCCC';
      public verticalGridThickness: number = 1;
      public verticalGridColor: string= '#CCCCCC';
      public displayUnits: number = 0;
      public decimalValue: number = 0;
       public rowpadding: number = 0;

      }

    // tslint:disable-next-line:max-classes-per-file
    export class ColumnHeaders {
      public fontColor: string = '#000';
      public backgroundColor: string = '#fff';
      public outline: string = 'border-bottom';
    }

    // tslint:disable-next-line:max-classes-per-file
    export class PersistExpandCollapseSettings {
      public expandCollapseState: string = '{}';
    }

    // tslint:disable-next-line:max-classes-per-file
    export class PersistSortSettings {
      public isSortAsc: boolean = true;
      public isSorted: boolean = false;
      public columnIndex: Number = 0;
    }

    // tslint:disable-next-line:max-classes-per-file
    export class PersistResizeSettings {
      public columnWidths: string = '{}';
      public gridWidth: Number = 0;
    }
}
