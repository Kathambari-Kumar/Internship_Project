import React from 'react';
import { Prescription } from '@/generated/prisma';

type prescriptionData = Prescription;
type GlassPrescriptionTableProps = {
  prescriptions: prescriptionData[];
};
const CustomerPrescriptionTable : React.FC<GlassPrescriptionTableProps> = ({ prescriptions }) => {

  /* 
    1. <React.Fragment> is a special component from React that lets you 
    group multiple children without adding extra DOM nodes.

          JSX Code                                 Expands To                                             
    <div className="box">Hi</div>      React.createElement("div", { className: "box" }, "Hi")
|   <Component prop="val" />           React.createElement(Component, { prop: "val" })
|   <></>                              React.createElement(React.Fragment, null)

  DOM element :	A tag in the HTML structure (e.g., <div>, <tr>, etc.)
  Extra DOM element :	A tag that exists only for grouping and is unnecessary in the output
  Fragment : (<>)	A React feature that lets you group children without adding an element to the DOM
  */
  return (
    <table className="table-auto w-full border border-gray-300 text-sm mt-2 mb-2">
    <tbody>
      {prescriptions.map((p) => (

        <React.Fragment key={p.id}>
        {/* anamnes*/}
        <tr  key={`${p.id}-anamnes`}>
          <td className="border px-2 py-1 font-bold" >Date</td>
          <td className="border px-2 py-1" colSpan={2}>{p.createdAt.toLocaleDateString()}</td>
          <td className="border px-2 py-1 font-bold" >Anamnes</td>
          <td className="border px-2 py-1" colSpan={9}>{p.currentSymptoms}</td>
        </tr>

        {/* Header for grouped values */}
        <tr key={`${p.id}-header`}>
          <th className="border px-2 py-1 text-left">Ögon</th>
          <th className="border px-2 py-1 text-left">Tid Glas</th>
          <th className="border px-2 py-1 text-left">P.D</th>
          <th className="border px-2 py-1 text-left">Fri Visus</th>
          <th className="border px-2 py-1 text-left">Visus</th>
          <th className="border px-2 py-1 text-left">Styrka</th>
          <th className="border px-2 py-1 text-left">Cylinder</th>
          <th className="border px-2 py-1 text-left">Axel</th>
          <th className="border px-2 py-1 text-left">Add</th>               
          <th className="border px-2 py-1 text-left">N Högd</th>       
          <th className="border px-2 py-1 text-left">Glas Typ</th>
        </tr>

        {/* Left Eye Values */}
        <tr key={`${p.id}-left`}>
          <td className="border px-2 py-1">Vänster</td>
          <td className="border px-2 py-1">{p.prevGlassLeft}</td>
          <td className="border px-2 py-1">{p.leftPD ?? '—'}</td>
          <td className="border px-2 py-1">{p.uncorrectedVisualLeft ?? '—'}</td>
          <td className="border px-2 py-1">{p.correctedVisualLeft ?? '—'}</td>
          <td className="border px-2 py-1">{p.lensPowerLeft ?? '—'}</td>
          <td className="border px-2 py-1">{p.cylinderLeft ?? '—'}</td>
          <td className="border px-2 py-1">{p.axisLeft ?? '—'}</td>
          <td className="border px-2 py-1">{p.addLeft ?? '—'}</td>
          <td className="border px-2 py-1">{p.noseHeightLeft ?? '—'}</td>         
          <td className="border px-2 py-1">{p.glassTypeLeft ?? '—'}</td>
        </tr>

        {/* Right Eye Values */}
        <tr key={`${p.id}-right`}>
          <td className="border px-2 py-1">Höger</td>
          <td className="border px-2 py-1">{p.prevGlassRight ?? '—'}</td>
          <td className="border px-2 py-1">{p.rightPD ?? '—'}</td>
          <td className="border px-2 py-1">{p.uncorrectedVisualLeft ?? '—'}</td>
          <td className="border px-2 py-1">{p.correctedVisualRight ?? '—'}</td>
          <td className="border px-2 py-1">{p.lensPowerRight ?? '—'}</td>
          <td className="border px-2 py-1">{p.cylinderRight ?? '—'}</td>
          <td className="border px-2 py-1">{p.axisRight ?? '—'}</td>
          <td className="border px-2 py-1">{p.addRight ?? '—'}</td>
          <td className="border px-2 py-1">{p.noseHeightRight ?? '—'}</td>     
          <td className="border px-2 py-1">{p.glassTypeRight ?? '—'}</td>
        </tr>

        {/* Båge Avstånd */}
        <tr key={`${p.id}-frameDistance`}>
          <td className="border px-2 py-1 font-semibold">Båge Avstånd</td>
          <td className="border px-2 py-1" colSpan={10}>{p.frameDistance ?? '—'}</td>
        </tr>

        {/* Båge Nära */}
        <tr key={`${p.id}-nearFrameDistance`}>
          <td className="border px-2 py-1 font-semibold">Båge Nära</td>
          <td className="border px-2 py-1" colSpan={10}>{p.nearFrameDistance ?? '—'}</td>
        </tr>
        <tr key={`${p.id}-spacer`}>
          <td className="border bg-amber-200 px-2 py-1" colSpan={11}></td>
        </tr>
      </React.Fragment>
      
      ))}
    </tbody>
  </table>
  );
};

export default CustomerPrescriptionTable;
