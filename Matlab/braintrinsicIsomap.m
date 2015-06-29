function [IsomapXYZ NewNW NewAnatomy NewLabelKey] = braintrinsicIsomap(NW, Anatomy, LabelKey, type, dim, n)
 
%This funciton generates the Isomap embedding using "BRAINtrinsic" as described in:
%BRAINtrinsic: A Virtual Reality-Compatible Tool for Exploring Intrinsic Topologies of the Human Brain Connectome
%by Giorgio Conte, Allen Ye, Angus Forbes, Olusola Ajilore, and Alex Leow,  Proceedings of BIH2015 (Lecture Notes in Computer Science).
%This routine generates necessary input for BRAINtrinsic at http://conect.brain.uic.edu/home/Software
%The last space/empty line in the generated csv files may need to be deleted
%before uploading to BRAINtrinsic.
%Input:

%1. NW: the N by N structural connectivity matrix (i.e., number of fibers) or the functional correlation matrix
%For functional connectome, the values are between [-1 1] with diagonal set to 1.

%2. "Anatomy" stores the ROI anatomical coordinates in the format: N-row by 3-colum

%3. LabelKey is a N-by-1 column vector, with each element indicating the Freesurfer value for its anatomical location. 
%For example, l-caudal anterior cingulate = 1002

%4. type='functional' or 'structural'.

%5. dim = the number of dimensions of the Isomap.

%6. n = number of nearest neighbors used when constructing local neighborhood graph (usually around 20-40)

% braintrinsicIsomap uses BCT m-files as well as the modified Isomap implementation by Van der Maaten: dimensionality reduction toolbox http://lvdmaaten.github.io/drtoolbox/
% Written by Alex Leow and Allen Ye 06/28/15
% Isomap implementation modified by Alex Leow
% Correspondences: {Alexfeuillet, UICoNECt} @gmail.com

disp('This funciton generates input files for BRAINtrinsic: http://conect.brain.uic.edu/home/Software');
disp('BRAINtrinsic is a virtual-reality compatible environment for the intrinsic geometry of a connectome.');
disp('Written by Alex Leow and Allen Ye. Dimensionality reduction routines are modified from: http://lvdmaaten.github.io/drtoolbox/');

switch type
     case 'structural'
            D = distance_wei(1./NW);
%distance_wei is a routine in BCT
     case 'functional'
            D = log(1./abs(NW)); 
            D(isinf(D))=0;
     otherwise
            error('Unknown connectome type.');
 end
 
[IsomapXYZ dump]=compute_mapping(D,'Isomap', dim, n);
figure;
scatter3(IsomapXYZ(:,1), IsomapXYZ(:,2), IsomapXYZ(:,3));
load('conn_comp.mat')
NewLabelKey=LabelKey(conn_comp);
NewNW=NW(conn_comp, conn_comp);
NewAnatomy=Anatomy(conn_comp,:);

csvwrite('IsoCentroids.csv', IsomapXYZ);
csvwrite('Centroids.csv', NewAnatomy);
csvwrite('LabelKey.csv', NewLabelKey);
switch type
     case 'structural'
           csvwrite('Connections.csv', NewNW);
     case 'functional'
           csvwrite('Connections.csv', abs(NewNW));

 end


